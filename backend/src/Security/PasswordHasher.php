<?php

declare(strict_types=1);

namespace App\Security;

final class PasswordHasher
{
    /**
     * Hash a plaintext password using Argon2id.
     */
    public static function hash(string $password): string
    {
        // Use Argon2id if available, fallback to Argon2i or Bcrypt as safety
        $algo = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_DEFAULT;
        $options = [
            'memory_cost' => 65536, // 64 MB
            'time_cost'   => 4,
            'threads'     => 1,
        ];

        $hash = password_hash($password, $algo, $options);
        if ($hash === false) {
            throw new \RuntimeException("Password hashing failed");
        }

        return $hash;
    }

    /**
     * Verify a password against an Argon2id hash.
     */
    public static function verify(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    /**
     * Check if the hash needs rehashing.
     */
    public static function needsRehash(string $hash): bool
    {
        $algo = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_DEFAULT;
        return password_needs_rehash($hash, $algo);
    }
}
