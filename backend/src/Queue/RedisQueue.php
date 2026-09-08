<?php

declare(strict_types=1);

namespace App\Queue;

use Predis\Client as RedisClient;
use App\Database\Connection;
use PDO;
use function App\Support\env;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class RedisQueue implements QueueInterface
{
    private RedisClient $redis;
    private string $prefix = 'jidosapp_queue:';

    public function __construct()
    {
        $redisUrl = env('REDIS_URL', 'tcp://127.0.0.1:6379');
        $this->redis = new RedisClient((string) $redisUrl);
    }

    public function push(string $jobClass, array $payload = [], int $delaySeconds = 0, string $queue = 'default'): string
    {
        $jobId = uuid_v4();
        $jobData = [
            'id'        => $jobId,
            'job'       => $jobClass,
            'payload'   => $payload,
            'attempts'  => 0,
            'queue'     => $queue,
            'created_at'=> time(),
        ];

        $encoded = json_encode($jobData);

        if ($delaySeconds > 0) {
            $availableAt = time() + $delaySeconds;
            $this->redis->zadd($this->prefix . 'delayed:' . $queue, [$encoded => $availableAt]);
        } else {
            $this->redis->rpush($this->prefix . $queue, [$encoded]);
        }

        return $jobId;
    }

    public function pop(string $queue = 'default', int $timeout = 2): ?array
    {
        // Migrate due delayed jobs into the primary queue list
        $this->migrateDelayedJobs($queue);

        // Pop from primary queue
        if ($timeout > 0) {
            $result = $this->redis->blpop([$this->prefix . $queue], $timeout);
            $raw = $result[1] ?? null;
        } else {
            $raw = $this->redis->lpop($this->prefix . $queue);
        }

        if (!$raw) {
            return null;
        }

        $data = json_decode((string) $raw, true);
        if (!is_array($data)) {
            return null;
        }

        $data['attempts'] = ($data['attempts'] ?? 0) + 1;
        return $data;
    }

    private function migrateDelayedJobs(string $queue): void
    {
        $now = time();
        $delayedKey = $this->prefix . 'delayed:' . $queue;
        $jobs = $this->redis->zrangebyscore($delayedKey, '-inf', (string) $now);

        if (!empty($jobs)) {
            foreach ($jobs as $jobString) {
                if ($this->redis->zrem($delayedKey, $jobString) > 0) {
                    $this->redis->rpush($this->prefix . $queue, [$jobString]);
                }
            }
        }
    }

    public function acknowledge(string $jobId, string $queue = 'default'): void
    {
        // Redis list already popped; nothing further needed for acknowledged jobs
    }

    public function fail(array $job, \Throwable $e): void
    {
        try {
            $pdo = Connection::get();
            $stmt = $pdo->prepare("
                INSERT INTO failed_jobs (id, connection, queue, payload, exception, failed_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                uuid_v4(),
                'redis',
                $job['queue'] ?? 'default',
                json_encode($job),
                $e->getMessage() . "\n" . $e->getTraceAsString(),
                current_timestamp(),
            ]);
        } catch (\Throwable) {
            // Silently log or ignore if DB insert fails
        }
    }

    public function release(array $job, int $delaySeconds = 30): void
    {
        $queue = $job['queue'] ?? 'default';
        $availableAt = time() + $delaySeconds;
        $encoded = json_encode($job);
        $this->redis->zadd($this->prefix . 'delayed:' . $queue, [$encoded => $availableAt]);
    }
}
