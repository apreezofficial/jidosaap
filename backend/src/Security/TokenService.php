<?php

declare(strict_types=1);

namespace App\Security;

use App\Config\AppConfig;
use RuntimeException;

final class TokenService
{
    /**
     * Generate a signed JWT token.
     *
     * @param array<string, mixed> $payload
     * @param int $ttlSeconds (default: 7 days)
     */
    public static function createToken(array $payload, int $ttlSeconds = 604800): string
    {
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256',
        ];

        $issuedAt = time();
        $payload['iat'] = $issuedAt;
        $payload['exp'] = $issuedAt + $ttlSeconds;
        $payload['iss'] = AppConfig::appUrl();

        $headerEncoded = self::base64UrlEncode(json_encode($header, JSON_THROW_ON_ERROR));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload, JSON_THROW_ON_ERROR));

        $signature = hash_hmac(
            'sha256',
            "{$headerEncoded}.{$payloadEncoded}",
            AppConfig::jwtSecret(),
            true
        );
        $signatureEncoded = self::base64UrlEncode($signature);

        return "{$headerEncoded}.{$payloadEncoded}.{$signatureEncoded}";
    }

    /**
     * Verify and decode a JWT token. Returns payload array or null if invalid/expired.
     *
     * @return array<string, mixed>|null
     */
    public static function verifyToken(string $jwt): ?array
    {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) {
            return null;
        }

        [$headerEncoded, $payloadEncoded, $signatureEncoded] = $parts;

        $expectedSig = hash_hmac(
            'sha256',
            "{$headerEncoded}.{$payloadEncoded}",
            AppConfig::jwtSecret(),
            true
        );

        $providedSig = self::base64UrlDecode($signatureEncoded);
        if ($providedSig === false || !hash_equals($expectedSig, $providedSig)) {
            return null;
        }

        $payloadJson = self::base64UrlDecode($payloadEncoded);
        if ($payloadJson === false) {
            return null;
        }

        try {
            $payload = json_decode($payloadJson, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return null;
        }

        // Check expiry
        if (isset($payload['exp']) && time() >= (int) $payload['exp']) {
            return null;
        }

        return $payload;
    }

    public static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    public static function base64UrlDecode(string $data): string|false
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $padLen = 4 - $remainder;
            $data .= str_repeat('=', $padLen);
        }
        return base64_decode(strtr($data, '-_', '+/'), true);
    }
}
