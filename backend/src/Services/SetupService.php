<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use App\Database\MigrationManager;
use App\Security\PasswordHasher;
use PDO;
use RuntimeException;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class SetupService
{
    private string $envPath;

    public function __construct()
    {
        $this->envPath = dirname(__DIR__, 2) . '/.env';
    }

    public function isConfigured(): bool
    {
        // Consider configured if .env exists AND has a real DB password set
        if (!file_exists($this->envPath)) return false;
        $content = file_get_contents($this->envPath);
        return str_contains($content, 'DB_HOST=') &&
               !str_contains($content, 'DB_PASSWORD=CHANGE_ME') &&
               !str_contains($content, 'DB_PASSWORD=');
    }

    public function hasAdminAccount(): bool
    {
        try {
            $pdo  = Connection::get();
            $stmt = $pdo->query("SELECT COUNT(*) FROM users");
            return (int)$stmt->fetchColumn() > 0;
        } catch (\Throwable) {
            return false;
        }
    }

    public function getStatus(): array
    {
        $configured = $this->isConfigured();
        $dbOk       = false;
        $redisOk    = false;
        $hasAdmin   = false;
        $migrationsRun = false;

        if ($configured) {
            try {
                $pdo = Connection::get();
                $pdo->query("SELECT 1");
                $dbOk = true;

                // Check if migrations ran
                $stmt = $pdo->query("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users'");
                $migrationsRun = (int)$stmt->fetchColumn() > 0;

                if ($migrationsRun) {
                    $hasAdmin = $this->hasAdminAccount();
                }
            } catch (\Throwable) {}

            try {
                $redis = new \Redis();
                $redis->connect(
                    getenv('REDIS_HOST') ?: '127.0.0.1',
                    (int)(getenv('REDIS_PORT') ?: 6379)
                );
                $redis->ping();
                $redisOk = true;
            } catch (\Throwable) {}
        }

        return [
            'configured'     => $configured,
            'database_ok'    => $dbOk,
            'redis_ok'       => $redisOk,
            'migrations_run' => $migrationsRun,
            'has_admin'      => $hasAdmin,
            'app_url'        => getenv('APP_URL') ?: '',
            'meta_configured' => !empty(getenv('META_APP_SECRET')),
            'openai_configured' => !empty(getenv('OPENAI_API_KEY')),
            'stripe_configured' => !empty(getenv('STRIPE_SECRET_KEY')),
        ];
    }

    public function testDatabase(string $host, int $port, string $db, string $user, string $pass): array
    {
        try {
            $pdo = new PDO(
                "pgsql:host={$host};port={$port};dbname={$db}",
                $user, $pass,
                [PDO::ATTR_TIMEOUT => 5, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
            $version = $pdo->query("SELECT version()")->fetchColumn();
            return ['success' => true, 'version' => $version];
        } catch (\Throwable $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    public function testRedis(string $host, int $port): array
    {
        try {
            $redis = new \Redis();
            $redis->connect($host, $port, 3);
            $redis->ping();
            return ['success' => true, 'message' => 'Redis connection successful'];
        } catch (\Throwable $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    public function testOpenAi(string $apiKey): array
    {
        $ch = curl_init('https://api.openai.com/v1/models');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 8,
            CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$apiKey}"],
        ]);
        curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($code === 200) {
            return ['success' => true, 'message' => 'OpenAI API key is valid'];
        }
        if ($code === 401) {
            return ['success' => false, 'error' => 'Invalid API key'];
        }
        return ['success' => false, 'error' => "API returned HTTP {$code}"];
    }

    public function testWhatsApp(string $token, string $phoneNumberId): array
    {
        $ch = curl_init("https://graph.facebook.com/v19.0/{$phoneNumberId}");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 8,
            CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$token}"],
        ]);
        $body = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($body ?: '{}', true);

        if ($code === 200 && !isset($data['error'])) {
            return [
                'success'      => true,
                'message'      => 'WhatsApp Business API connection verified',
                'display_name' => $data['display_phone_number'] ?? $data['verified_name'] ?? '',
            ];
        }

        return [
            'success' => false,
            'error'   => $data['error']['message'] ?? "API returned HTTP {$code}",
        ];
    }

    public function saveConfiguration(array $data): array
    {
        $lines   = [];
        $lines[] = '# JidoSapp Configuration';
        $lines[] = '# Generated by setup wizard — keep this file private!';
        $lines[] = '';

        $required = [
            'APP_ENV'          => $data['app_env']        ?? 'production',
            'APP_DEBUG'        => ($data['app_env'] ?? 'production') === 'local' ? 'true' : 'false',
            'APP_URL'          => rtrim($data['app_url'] ?? 'http://localhost:8000', '/'),
            'FRONTEND_URL'     => rtrim($data['frontend_url'] ?? 'http://localhost:3000', '/'),
        ];

        $db = [
            'DB_CONNECTION' => 'pgsql',
            'DB_HOST'       => $data['db_host']     ?? '127.0.0.1',
            'DB_PORT'       => $data['db_port']     ?? '5432',
            'DB_DATABASE'   => $data['db_database'] ?? 'jidosapp',
            'DB_USERNAME'   => $data['db_username'] ?? 'postgres',
            'DB_PASSWORD'   => $data['db_password'] ?? '',
        ];

        $redis = [
            'REDIS_HOST'     => $data['redis_host']     ?? '127.0.0.1',
            'REDIS_PORT'     => $data['redis_port']     ?? '6379',
            'REDIS_PASSWORD' => $data['redis_password'] ?? 'null',
        ];

        $meta = [
            'META_APP_ID'       => $data['meta_app_id']       ?? '',
            'META_APP_SECRET'   => $data['meta_app_secret']   ?? '',
            'META_VERIFY_TOKEN' => $data['meta_verify_token'] ?? ('jidosapp_' . bin2hex(random_bytes(8))),
        ];

        $ai = [
            'OPENAI_API_KEY'    => $data['openai_api_key']    ?? '',
            'OPENAI_MODEL'      => $data['openai_model']      ?? 'gpt-4o-mini',
            'OPENAI_MAX_TOKENS' => '1024',
        ];

        $stripe = [
            'STRIPE_SECRET_KEY'      => $data['stripe_secret_key']      ?? '',
            'STRIPE_PUBLISHABLE_KEY' => $data['stripe_publishable_key'] ?? '',
            'STRIPE_WEBHOOK_SECRET'  => $data['stripe_webhook_secret']  ?? '',
        ];

        $s3 = [
            'S3_ENDPOINT'   => $data['s3_endpoint']   ?? '',
            'S3_REGION'     => $data['s3_region']      ?? 'us-east-1',
            'S3_BUCKET'     => $data['s3_bucket']      ?? 'jidosapp-uploads',
            'S3_ACCESS_KEY' => $data['s3_access_key']  ?? '',
            'S3_SECRET_KEY' => $data['s3_secret_key']  ?? '',
        ];

        $security = [
            'JWT_SECRET'     => bin2hex(random_bytes(32)),
            'JWT_TTL'        => '604800',
            'ENCRYPTION_KEY' => bin2hex(random_bytes(32)),
        ];

        $sections = [
            '# Application'             => $required,
            '# Database'                => $db,
            '# Redis'                   => $redis,
            '# Meta WhatsApp Cloud API' => $meta,
            '# OpenAI'                  => $ai,
            '# Stripe Billing'          => $stripe,
            '# S3 Storage'              => $s3,
            '# Security Keys'           => $security,
        ];

        foreach ($sections as $comment => $vars) {
            $lines[] = $comment;
            foreach ($vars as $k => $v) {
                $val = str_contains((string)$v, ' ') ? "\"{$v}\"" : (string)$v;
                $lines[] = "{$k}={$val}";
            }
            $lines[] = '';
        }

        file_put_contents($this->envPath, implode(PHP_EOL, $lines));

        // Reload env
        foreach (array_merge(...array_values($sections)) as $k => $v) {
            putenv("{$k}={$v}");
            $_ENV[$k] = $v;
        }

        return [
            'saved'           => true,
            'env_path'        => $this->envPath,
            'webhook_url'     => ($required['APP_URL'] ?? '') . '/api/webhooks/whatsapp',
            'verify_token'    => $meta['META_VERIFY_TOKEN'],
        ];
    }

    public function runMigrations(): array
    {
        $migrator = new MigrationManager();
        $ran      = $migrator->run();
        return ['ran' => $ran, 'count' => count($ran)];
    }

    public function createAdminAccount(string $name, string $email, string $password, string $workspaceName): array
    {
        $name  = trim($name);
        $email = strtolower(trim($email));

        if (empty($name) || empty($email) || empty($password)) {
            throw new RuntimeException("Name, email, and password are required", 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException("Invalid email address", 422);
        }
        if (strlen($password) < 8) {
            throw new RuntimeException("Password must be at least 8 characters", 422);
        }

        $pdo  = Connection::get();
        $now  = current_timestamp();

        $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$email]);
        if ($check->fetch()) {
            throw new RuntimeException("An account with this email already exists", 409);
        }

        $userId   = uuid_v4();
        $wsId     = uuid_v4();
        $slug     = strtolower(preg_replace('/[^a-z0-9]+/', '-', $workspaceName)) . '-' . substr($userId, 0, 6);
        $passHash = PasswordHasher::hash($password);

        $pdo->prepare("
            INSERT INTO users (id, name, email, password_hash, status, email_verified_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'active', ?, ?, ?)
        ")->execute([$userId, $name, $email, $passHash, $now, $now, $now]);

        $pdo->prepare("
            INSERT INTO workspaces (id, name, slug, timezone, currency, business_type, created_by, created_at, updated_at)
            VALUES (?, ?, ?, 'UTC', 'USD', 'services', ?, ?, ?)
        ")->execute([$wsId, $workspaceName, $slug, $userId, $now, $now]);

        $pdo->prepare("
            INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at, updated_at)
            VALUES (?, ?, ?, 'owner', ?, ?)
        ")->execute([uuid_v4(), $wsId, $userId, $now, $now]);

        // Seed plans
        $this->seedPlans($pdo, $now);

        return [
            'user_id'        => $userId,
            'workspace_id'   => $wsId,
            'name'           => $name,
            'email'          => $email,
            'workspace_name' => $workspaceName,
        ];
    }

    private function seedPlans(PDO $pdo, string $now): void
    {
        $plans = [
            ['starter',  'Starter',  15.00,  144.00,  '{"ai_conversations":500,"automation_runs":1000,"connections":1,"contacts":500,"members":1,"storage_gb":1}'],
            ['business', 'Business', 39.00,  372.00,  '{"ai_conversations":2500,"automation_runs":10000,"connections":3,"contacts":5000,"members":5,"storage_gb":10}'],
            ['pro',      'Pro',      99.00,  948.00,  '{"ai_conversations":10000,"automation_runs":50000,"connections":10,"contacts":25000,"members":15,"storage_gb":50}'],
            ['agency',   'Agency',   249.00, 2388.00, '{"ai_conversations":-1,"automation_runs":-1,"connections":-1,"contacts":-1,"members":-1,"storage_gb":250}'],
        ];
        foreach ($plans as [$pSlug, $pName, $monthly, $yearly, $limits]) {
            $chk = $pdo->prepare("SELECT id FROM plans WHERE slug = ?");
            $chk->execute([$pSlug]);
            if (!$chk->fetch()) {
                $pdo->prepare("
                    INSERT INTO plans (id, name, slug, price_monthly, price_yearly, limits_json, is_active, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, 1, ?)
                ")->execute([uuid_v4(), $pName, $pSlug, $monthly, $yearly, $limits, $now]);
            }
        }
    }
}
