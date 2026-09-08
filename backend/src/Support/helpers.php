<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Generate a cryptographically secure UUID v4 string.
 */
function uuid_v4(): string
{
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10

    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

/**
 * Get an environment variable with optional default.
 */
function env(string $key, mixed $default = null): mixed
{
    $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

    if ($value === false || $value === null) {
        return $default;
    }

    return match (strtolower((string) $value)) {
        'true', '(true)' => true,
        'false', '(false)' => false,
        'empty', '(empty)' => '',
        'null', '(null)' => null,
        default => $value,
    };
}

/**
 * Standard JSON response helper.
 */
function json_response(mixed $data = null, int $status = 200, ?string $message = null, bool $success = true): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');

    $response = [
        'success' => $success,
    ];

    if ($success) {
        $response['data'] = $data;
        $response['message'] = $message;
    } else {
        $response['error'] = is_array($data) ? $data : [
            'code' => 'ERROR',
            'message' => $data ?? $message ?? 'An error occurred',
        ];
    }

    echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Return current ISO-8601 UTC timestamp.
 */
function current_timestamp(): string
{
    return (new \DateTimeImmutable('now', new \DateTimeZone('UTC')))->format('Y-m-d H:i:s');
}
