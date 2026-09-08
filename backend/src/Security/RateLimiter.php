<?php

declare(strict_types=1);

namespace App\Security;

use App\Database\Connection;
use PDO;
use function App\Support\current_timestamp;

final class RateLimiter
{
    /**
     * Check if request exceeds limit (sliding window).
     *
     * @param string $key (e.g. "login:ip_1.2.3.4")
     * @param int $maxAttempts
     * @param int $decaySeconds
     */
    public static function check(string $key, int $maxAttempts = 60, int $decaySeconds = 60): bool
    {
        // Simple file / memory cache or DB rate limiting
        $storageDir = dirname(__DIR__, 2) . '/storage/framework/ratelimit';
        if (!is_dir($storageDir)) {
            mkdir($storageDir, 0777, true);
        }

        $hashKey = hash('sha256', $key);
        $file = $storageDir . '/' . $hashKey . '.json';

        $now = time();
        $records = [];

        if (file_exists($file)) {
            $data = json_decode((string) file_get_contents($file), true);
            if (is_array($data)) {
                // Filter out timestamps older than decay window
                $windowStart = $now - $decaySeconds;
                $records = array_values(array_filter($data, fn($t) => $t > $windowStart));
            }
        }

        if (count($records) >= $maxAttempts) {
            return false; // Rate limit exceeded
        }

        $records[] = $now;
        file_put_contents($file, json_encode($records));

        return true;
    }

    public static function clear(string $key): void
    {
        $hashKey = hash('sha256', $key);
        $file = dirname(__DIR__, 2) . '/storage/framework/ratelimit/' . $hashKey . '.json';
        if (file_exists($file)) {
            @unlink($file);
        }
    }
}
