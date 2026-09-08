<?php

declare(strict_types=1);

namespace App\Queue;

use App\Database\Connection;
use PDO;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class DatabaseQueue implements QueueInterface
{
    public function push(string $jobClass, array $payload = [], int $delaySeconds = 0, string $queue = 'default'): string
    {
        $jobId = uuid_v4();
        $pdo = Connection::get();
        $now = time();
        $availableAt = date('Y-m-d H:i:s', $now + $delaySeconds);
        $createdAt = date('Y-m-d H:i:s', $now);

        $jobData = [
            'id'        => $jobId,
            'job'       => $jobClass,
            'payload'   => $payload,
            'attempts'  => 0,
            'queue'     => $queue,
        ];

        $stmt = $pdo->prepare("
            INSERT INTO jobs (id, queue, payload, attempts, reserved_at, available_at, created_at)
            VALUES (?, ?, ?, 0, NULL, ?, ?)
        ");
        $stmt->execute([$jobId, $queue, json_encode($jobData), $availableAt, $createdAt]);

        return $jobId;
    }

    public function pop(string $queue = 'default', int $timeout = 0): ?array
    {
        $pdo = Connection::get();
        $now = date('Y-m-d H:i:s');

        return Connection::transaction(function (PDO $pdo) use ($queue, $now) {
            $stmt = $pdo->prepare("
                SELECT * FROM jobs 
                WHERE queue = ? AND reserved_at IS NULL AND available_at <= ? 
                ORDER BY created_at ASC 
                LIMIT 1
            ");
            $stmt->execute([$queue, $now]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                return null;
            }

            $update = $pdo->prepare("UPDATE jobs SET reserved_at = ?, attempts = attempts + 1 WHERE id = ?");
            $update->execute([$now, $row['id']]);

            $jobData = json_decode($row['payload'], true);
            $jobData['attempts'] = (int) $row['attempts'] + 1;
            return $jobData;
        });
    }

    public function acknowledge(string $jobId, string $queue = 'default'): void
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = ?");
        $stmt->execute([$jobId]);
    }

    public function fail(array $job, \Throwable $e): void
    {
        $pdo = Connection::get();
        $jobId = $job['id'] ?? uuid_v4();

        // Delete from active jobs
        $del = $pdo->prepare("DELETE FROM jobs WHERE id = ?");
        $del->execute([$jobId]);

        // Insert into failed_jobs
        $stmt = $pdo->prepare("
            INSERT INTO failed_jobs (id, connection, queue, payload, exception, failed_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            uuid_v4(),
            'database',
            $job['queue'] ?? 'default',
            json_encode($job),
            $e->getMessage() . "\n" . $e->getTraceAsString(),
            current_timestamp(),
        ]);
    }

    public function release(array $job, int $delaySeconds = 30): void
    {
        $pdo = Connection::get();
        $jobId = $job['id'] ?? null;
        if (!$jobId) {
            return;
        }

        $now = time();
        $availableAt = date('Y-m-d H:i:s', $now + $delaySeconds);

        $stmt = $pdo->prepare("
            UPDATE jobs 
            SET reserved_at = NULL, available_at = ?, payload = ?
            WHERE id = ?
        ");
        $stmt->execute([$availableAt, json_encode($job), $jobId]);
    }
}
