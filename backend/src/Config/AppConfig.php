<?php

declare(strict_types=1);

namespace App\Config;

use function App\Support\env;

final class AppConfig
{
    public static function appEnv(): string
    {
        return (string) env('APP_ENV', 'production');
    }

    public static function isDebug(): bool
    {
        return (bool) env('APP_DEBUG', false);
    }

    public static function appUrl(): string
    {
        return rtrim((string) env('APP_URL', 'http://localhost:8000'), '/');
    }

    public static function frontendUrl(): string
    {
        return rtrim((string) env('FRONTEND_URL', 'http://localhost:3000'), '/');
    }

    public static function jwtSecret(): string
    {
        $secret = env('JWT_SECRET');
        if (empty($secret)) {
            return 'jidosapp_default_secure_key_must_be_changed_in_prod_32';
        }
        return (string) $secret;
    }

    public static function encryptionKey(): string
    {
        $key = env('ENCRYPTION_KEY');
        if (empty($key)) {
            return 'jidosapp_default_encryption_key_32_bytes_len!';
        }
        return (string) $key;
    }

    public static function metaVerifyToken(): string
    {
        return (string) env('META_VERIFY_TOKEN', 'jidosapp_meta_verify_token');
    }

    public static function metaAppSecret(): string
    {
        return (string) env('META_APP_SECRET', '');
    }

    public static function metaAppId(): string
    {
        return (string) env('META_APP_ID', '');
    }

    public static function openAiApiKey(): string
    {
        return (string) env('OPENAI_API_KEY', '');
    }

    public static function stripeSecretKey(): string
    {
        return (string) env('STRIPE_SECRET_KEY', '');
    }

    public static function stripeWebhookSecret(): string
    {
        return (string) env('STRIPE_WEBHOOK_SECRET', '');
    }
}
