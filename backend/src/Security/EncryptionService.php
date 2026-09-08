<?php

declare(strict_types=1);

namespace App\Security;

use App\Config\AppConfig;
use RuntimeException;

final class EncryptionService
{
    private const CIPHER = 'aes-256-gcm';
    private const TAG_LENGTH = 16;
    private const IV_LENGTH = 12;

    private static function getKey(): string
    {
        $rawKey = AppConfig::encryptionKey();
        // Derive exact 32-byte key via SHA-256
        return hash('sha256', $rawKey, true);
    }

    /**
     * Encrypt sensitive string data using AES-256-GCM.
     */
    public static function encrypt(string $plaintext): string
    {
        $key = self::getKey();
        $iv = random_bytes(self::IV_LENGTH);
        $tag = '';

        $ciphertext = openssl_encrypt(
            $plaintext,
            self::CIPHER,
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag,
            '',
            self::TAG_LENGTH
        );

        if ($ciphertext === false) {
            throw new RuntimeException("Encryption failed");
        }

        // Pack iv + tag + ciphertext and base64 encode
        $payload = pack('a12a16a*', $iv, $tag, $ciphertext);
        return base64_encode($payload);
    }

    /**
     * Decrypt encrypted payload using AES-256-GCM.
     */
    public static function decrypt(string $payload): ?string
    {
        $raw = base64_decode($payload, true);
        if ($raw === false || strlen($raw) < (self::IV_LENGTH + self::TAG_LENGTH)) {
            return null;
        }

        $key = self::getKey();
        $iv = substr($raw, 0, self::IV_LENGTH);
        $tag = substr($raw, self::IV_LENGTH, self::TAG_LENGTH);
        $ciphertext = substr($raw, self::IV_LENGTH + self::TAG_LENGTH);

        $plaintext = openssl_decrypt(
            $ciphertext,
            self::CIPHER,
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        if ($plaintext === false) {
            return null;
        }

        return $plaintext;
    }
}
