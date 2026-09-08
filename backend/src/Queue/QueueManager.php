<?php

declare(strict_types=1);

namespace App\Queue;

use function App\Support\env;

final class QueueManager
{
    private static ?QueueInterface $driver = null;

    public static function getDriver(): QueueInterface
    {
        if (self::$driver !== null) {
            return self::$driver;
        }

        $preferred = env('QUEUE_DRIVER', 'redis');

        if ($preferred === 'redis') {
            try {
                self::$driver = new RedisQueue();
                return self::$driver;
            } catch (\Throwable) {
                // Graceful fallback to database queue if Redis is not running locally
                self::$driver = new DatabaseQueue();
                return self::$driver;
            }
        }

        self::$driver = new DatabaseQueue();
        return self::$driver;
    }

    public static function push(string $jobClass, array $payload = [], int $delaySeconds = 0, string $queue = 'default'): string
    {
        return self::getDriver()->push($jobClass, $payload, $delaySeconds, $queue);
    }
}
