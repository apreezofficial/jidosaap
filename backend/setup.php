<?php

/**
 * JidoSapp Interactive Setup Wizard
 *
 * Run: php setup.php
 *
 * This script guides you through the complete self-hosted configuration:
 *   - Database connection
 *   - WhatsApp Business API (Meta)
 *   - OpenAI API
 *   - Stripe payments (optional)
 *   - S3 storage (optional)
 *   - Admin account creation
 *   - Database migration + seeding
 */

declare(strict_types=1);

// ─── Helpers ────────────────────────────────────────────────────────────────

function line(string $text = ''): void { echo $text . PHP_EOL; }
function head(string $text): void { line(); line("\033[1;36m" . $text . "\033[0m"); line(str_repeat('─', strlen($text))); }
function success(string $text): void { line("\033[0;32m✓ " . $text . "\033[0m"); }
function warn(string $text): void { line("\033[0;33m⚠ " . $text . "\033[0m"); }
function error(string $text): void { line("\033[0;31m✗ " . $text . "\033[0m"); }
function info(string $text): void { line("\033[0;34mℹ " . $text . "\033[0m"); }

function ask(string $question, string $default = '', bool $secret = false): string
{
    $hint = $default !== '' ? " [\033[0;33m{$default}\033[0m]" : '';
    echo "\033[1m{$question}\033[0m{$hint}: ";

    if ($secret && PHP_OS_FAMILY !== 'Windows') {
        system('stty -echo');
        $value = trim(fgets(STDIN));
        system('stty echo');
        echo PHP_EOL;
    } else {
        $value = trim(fgets(STDIN));
    }

    return $value !== '' ? $value : $default;
}

function confirm(string $question, bool $default = true): bool
{
    $hint = $default ? '[Y/n]' : '[y/N]';
    echo "\033[1m{$question}\033[0m {$hint}: ";
    $value = strtolower(trim(fgets(STDIN)));
    if ($value === '') return $default;
    return in_array($value, ['y', 'yes'], true);
}

function testPgsql(string $host, int $port, string $db, string $user, string $pass): bool
{
    try {
        $pdo = new PDO("pgsql:host={$host};port={$port};dbname={$db}", $user, $pass, [PDO::ATTR_TIMEOUT => 5]);
        return true;
    } catch (\Throwable) {
        return false;
    }
}

function testOpenAi(string $apiKey): bool
{
    $ch = curl_init('https://api.openai.com/v1/models');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8,
        CURLOPT_HTTPHEADER => ["Authorization: Bearer {$apiKey}"]]);
    curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $code === 200;
}

function testMetaToken(string $token, string $phoneNumberId): bool
{
    $ch = curl_init("https://graph.facebook.com/v19.0/{$phoneNumberId}");
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8,
        CURLOPT_HTTPHEADER => ["Authorization: Bearer {$token}"]]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $code === 200 && !str_contains((string)$body, '"error"');
}

function generateSecret(int $bytes = 32): string
{
    return bin2hex(random_bytes($bytes));
}

function writeEnvFile(array $values, string $path): void
{
    $lines = [];
    foreach ($values as $key => $value) {
        if ($key === '__COMMENT__') {
            $lines[] = '';
            $lines[] = "# {$value}";
            continue;
        }
        // Quote values with spaces
        $val = str_contains((string)$value, ' ') ? "\"{$value}\"" : (string)$value;
        $lines[] = "{$key}={$val}";
    }
    file_put_contents($path, implode(PHP_EOL, $lines) . PHP_EOL);
}

// ─── Banner ─────────────────────────────────────────────────────────────────

line();
line("\033[1;37m╔══════════════════════════════════════════════════════╗\033[0m");
line("\033[1;37m║  \033[1;31mJidoSapp\033[1;37m — Self-Hosted Setup Wizard               ║\033[0m");
line("\033[1;37m║  \033[0;37mPut WhatsApp on Autopilot. Jidō (自動)\033[1;37m            ║\033[0m");
line("\033[1;37m╚══════════════════════════════════════════════════════╝\033[0m");
line();
info("This wizard will configure your self-hosted JidoSapp instance.");
info("You'll need: PostgreSQL, Redis, Meta WhatsApp Business API credentials.");
info("OpenAI and Stripe are optional but recommended.");
line();

if (!confirm("Ready to begin?", true)) {
    line("Setup cancelled.");
    exit(0);
}

$env = [];

// ─── Step 1: Application ────────────────────────────────────────────────────

head("STEP 1 — Application");

$appUrl    = ask("Your public URL (e.g. https://jido.yourdomain.com)", "http://localhost:8000");
$frontendUrl = ask("Frontend URL (e.g. https://app.yourdomain.com)", "http://localhost:3000");
$appEnv    = ask("Environment", "production");

$env['__COMMENT__'] = 'Application';
$env['APP_ENV']     = $appEnv;
$env['APP_DEBUG']   = $appEnv === 'local' ? 'true' : 'false';
$env['APP_URL']     = $appUrl;
$env['FRONTEND_URL'] = $frontendUrl;

success("Application config set.");

// ─── Step 2: Database ────────────────────────────────────────────────────────

head("STEP 2 — PostgreSQL Database");
info("JidoSapp requires PostgreSQL 14+ (pgvector recommended for AI features).");
line();

$dbHost = ask("DB Host", "127.0.0.1");
$dbPort = (int) ask("DB Port", "5432");
$dbName = ask("DB Name", "jidosapp");
$dbUser = ask("DB Username", "postgres");
$dbPass = ask("DB Password", "", true);

echo "Testing database connection...";
if (testPgsql($dbHost, $dbPort, $dbName, $dbUser, $dbPass)) {
    success(" Connected!");
} else {
    warn(" Could not connect. Check credentials. You can fix this in .env later.");
}

$env['__COMMENT___db'] = 'Database';
$env['DB_CONNECTION'] = 'pgsql';
$env['DB_HOST']       = $dbHost;
$env['DB_PORT']       = (string)$dbPort;
$env['DB_DATABASE']   = $dbName;
$env['DB_USERNAME']   = $dbUser;
$env['DB_PASSWORD']   = $dbPass;

// ─── Step 3: Redis ───────────────────────────────────────────────────────────

head("STEP 3 — Redis Queue");
info("Redis is used for the job queue (WhatsApp sending, AI processing, automations).");
line();

$redisHost = ask("Redis Host", "127.0.0.1");
$redisPort = ask("Redis Port", "6379");
$redisPass = ask("Redis Password (leave blank if none)", "");

$env['__COMMENT___redis'] = 'Redis';
$env['REDIS_HOST']        = $redisHost;
$env['REDIS_PORT']        = $redisPort;
$env['REDIS_PASSWORD']    = $redisPass ?: 'null';

success("Redis config set.");

// ─── Step 4: WhatsApp Business API ──────────────────────────────────────────

head("STEP 4 — Meta WhatsApp Business Cloud API");
line();
info("You need a Meta Developer account and a WhatsApp Business App.");
info("Guide: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started");
line();
info("Required credentials:");
info("  • Phone Number ID   → Meta Business Manager → WhatsApp → API Setup");
info("  • WABA ID           → WhatsApp Business Account ID");
info("  • Permanent Token   → System User Token from Meta Business Manager");
info("  • App Secret        → Meta App Dashboard → Settings → Basic");
line();

$metaAppId     = ask("Meta App ID");
$metaAppSecret = ask("Meta App Secret", "", true);
$metaVerifyToken = ask("Webhook Verify Token (you choose this)", "jidosapp_" . substr(generateSecret(8), 0, 16));

if (!empty($metaAppId) && !empty($metaAppSecret)) {
    success("Meta credentials saved.");
    line();
    info("After saving, configure your webhook in Meta:");
    info("  URL:          {$appUrl}/api/webhooks/whatsapp");
    info("  Verify Token: {$metaVerifyToken}");
    info("  Subscribe to: messages");
    line();
    info("You'll connect your actual WhatsApp phone number in the app dashboard");
    info("under Settings → Integrations → WhatsApp → Connect Account.");
} else {
    warn("Skipped Meta config. You can add it in .env later.");
}

$env['__COMMENT___wa'] = 'Meta WhatsApp Business Cloud API';
$env['META_APP_ID']       = $metaAppId;
$env['META_APP_SECRET']   = $metaAppSecret;
$env['META_VERIFY_TOKEN'] = $metaVerifyToken;

// ─── Step 5: OpenAI ─────────────────────────────────────────────────────────

head("STEP 5 — OpenAI (AI Agent + Content Generation)");
line();
info("OpenAI powers AI agents, content generation, and intent classification.");
info("Get your key at: https://platform.openai.com/api-keys");
line();

$openAiKey   = ask("OpenAI API Key (sk-...)", "", true);
$openAiModel = ask("Model", "gpt-4o-mini");

if (!empty($openAiKey)) {
    echo "Testing OpenAI connection...";
    if (testOpenAi($openAiKey)) {
        success(" Connected!");
    } else {
        warn(" Could not verify key. Check it at platform.openai.com.");
    }
} else {
    warn("Skipped OpenAI. AI features will be disabled until configured.");
}

$env['__COMMENT___ai'] = 'OpenAI';
$env['OPENAI_API_KEY'] = $openAiKey;
$env['OPENAI_MODEL']   = $openAiModel;
$env['OPENAI_MAX_TOKENS'] = '1024';

// ─── Step 6: Stripe (optional) ──────────────────────────────────────────────

head("STEP 6 — Stripe Billing (Optional)");
line();
info("Stripe handles subscriptions. Skip if you're self-hosting for personal use.");
line();

$setupStripe = confirm("Set up Stripe billing?", false);
$stripeKey     = '';
$stripeWebhook = '';
$stripePub     = '';

if ($setupStripe) {
    info("Get keys at: https://dashboard.stripe.com/apikeys");
    $stripeKey     = ask("Stripe Secret Key (sk_...)", "", true);
    $stripePub     = ask("Stripe Publishable Key (pk_...)");
    $stripeWebhook = ask("Stripe Webhook Secret (whsec_...)");
    success("Stripe config saved.");
    line();
    info("Configure Stripe webhook endpoint:");
    info("  URL:       {$appUrl}/api/v1/billing/webhook/stripe");
    info("  Events:    checkout.session.completed, customer.subscription.updated,");
    info("             customer.subscription.deleted, invoice.payment_failed");
}

$env['__COMMENT___stripe'] = 'Stripe Billing';
$env['STRIPE_SECRET_KEY']      = $stripeKey;
$env['STRIPE_PUBLISHABLE_KEY'] = $stripePub;
$env['STRIPE_WEBHOOK_SECRET']  = $stripeWebhook;

// ─── Step 7: S3 Storage (optional) ──────────────────────────────────────────

head("STEP 7 — File Storage (Optional)");
line();
info("S3-compatible storage for media uploads, documents, knowledge base files.");
info("Works with AWS S3, Cloudflare R2, MinIO, DigitalOcean Spaces, Backblaze B2.");
line();

$setupS3 = confirm("Set up S3 storage?", false);
$s3Endpoint = $s3Key = $s3Secret = $s3Bucket = $s3Region = '';

if ($setupS3) {
    $s3Endpoint = ask("S3 Endpoint URL", "https://s3.amazonaws.com");
    $s3Region   = ask("Region", "us-east-1");
    $s3Bucket   = ask("Bucket Name", "jidosapp-uploads");
    $s3Key      = ask("Access Key ID");
    $s3Secret   = ask("Secret Access Key", "", true);
    success("S3 config saved.");
}

$env['__COMMENT___s3'] = 'S3 Storage';
$env['S3_ENDPOINT']   = $s3Endpoint;
$env['S3_REGION']     = $s3Region;
$env['S3_BUCKET']     = $s3Bucket;
$env['S3_ACCESS_KEY'] = $s3Key;
$env['S3_SECRET_KEY'] = $s3Secret;

// ─── Step 8: Security Keys ───────────────────────────────────────────────────

head("STEP 8 — Security Keys (Auto-Generated)");
line();
info("Generating cryptographically secure JWT and encryption keys...");

$jwtSecret     = generateSecret(32);
$encryptionKey = generateSecret(32);

$env['__COMMENT___sec'] = 'Security Keys (auto-generated — keep secret!)';
$env['JWT_SECRET']     = $jwtSecret;
$env['JWT_TTL']        = '604800';
$env['ENCRYPTION_KEY'] = $encryptionKey;

success("JWT secret:     {$jwtSecret}");
success("Encryption key: {$encryptionKey}");

// ─── Write .env ─────────────────────────────────────────────────────────────

head("Writing .env file");

$envPath = __DIR__ . '/.env';

// Flatten comments into real keys with proper structure
$finalEnv = [];
foreach ($env as $key => $value) {
    if (str_starts_with($key, '__COMMENT__')) {
        $finalEnv[$key] = $value;
    } else {
        $finalEnv[$key] = $value;
    }
}

writeEnvFile($finalEnv, $envPath);
success(".env written to: {$envPath}");

// ─── Step 9: Database Migration ─────────────────────────────────────────────

head("STEP 9 — Database Setup");
line();

if (confirm("Run database migrations now?", true)) {
    require_once __DIR__ . '/vendor/autoload.php';

    // Load the env we just wrote
    if (class_exists('\Dotenv\Dotenv')) {
        $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv->safeLoad();
    }

    try {
        $pdo = new \PDO(
            "pgsql:host={$dbHost};port={$dbPort};dbname={$dbName}",
            $dbUser, $dbPass,
            [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION]
        );
        $migrator = new \App\Database\MigrationManager($pdo);
        $ran = $migrator->run();

        if (empty($ran)) {
            info("Database already up to date.");
        } else {
            foreach ($ran as $file) {
                success("Migrated: {$file}");
            }
        }
    } catch (\Throwable $e) {
        error("Migration failed: " . $e->getMessage());
        warn("Run manually later: php migrate.php");
    }
}

// ─── Step 10: Admin Account ─────────────────────────────────────────────────

head("STEP 10 — Create Your Admin Account");
line();

$createAdmin = confirm("Create your admin account now?", true);

if ($createAdmin) {
    require_once __DIR__ . '/vendor/autoload.php';

    if (class_exists('\Dotenv\Dotenv')) {
        $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv->safeLoad();
    }

    $adminName      = ask("Your Name", "Admin");
    $adminEmail     = ask("Your Email");
    $adminPassword  = ask("Password (min 8 chars)", "", true);
    $workspaceName  = ask("Your Business/Workspace Name", "My Business");

    if (strlen($adminPassword) < 8) {
        warn("Password too short — using 'changeme1' as temporary password.");
        $adminPassword = 'changeme1';
    }

    try {
        $pdo = new \PDO(
            "pgsql:host={$dbHost};port={$dbPort};dbname={$dbName}",
            $dbUser, $dbPass,
            [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION]
        );

        $userId      = \App\Support\uuid_v4();
        $wsId        = \App\Support\uuid_v4();
        $memberId    = \App\Support\uuid_v4();
        $now         = \App\Support\current_timestamp();
        $passwordHash = \App\Security\PasswordHasher::hash($adminPassword);
        $slug        = strtolower(preg_replace('/[^a-z0-9]+/', '-', $workspaceName)) . '-' . substr($userId, 0, 6);

        // Check if email already exists
        $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$adminEmail]);
        if ($check->fetch()) {
            warn("User with that email already exists. Skipping account creation.");
        } else {
            $pdo->prepare("
                INSERT INTO users (id, name, email, password_hash, status, email_verified_at, created_at, updated_at)
                VALUES (?, ?, ?, ?, 'active', ?, ?, ?)
            ")->execute([$userId, $adminName, $adminEmail, $passwordHash, $now, $now, $now]);

            $pdo->prepare("
                INSERT INTO workspaces (id, name, slug, timezone, currency, business_type, created_by, created_at, updated_at)
                VALUES (?, ?, ?, 'UTC', 'USD', 'services', ?, ?, ?)
            ")->execute([$wsId, $workspaceName, $slug, $userId, $now, $now]);

            $pdo->prepare("
                INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at, updated_at)
                VALUES (?, ?, ?, 'owner', ?, ?)
            ")->execute([$memberId, $wsId, $userId, $now, $now]);

            // Seed plans if not exist
            $plans = [
                ['starter',  'Starter',  15.00,  144.00,  '{"ai_conversations":500,"automation_runs":1000,"connections":1,"contacts":500,"members":1,"storage_gb":1}'],
                ['business', 'Business', 39.00,  372.00,  '{"ai_conversations":2500,"automation_runs":10000,"connections":3,"contacts":5000,"members":5,"storage_gb":10}'],
                ['pro',      'Pro',      99.00,  948.00,  '{"ai_conversations":10000,"automation_runs":50000,"connections":10,"contacts":25000,"members":15,"storage_gb":50}'],
                ['agency',   'Agency',   249.00, 2388.00, '{"ai_conversations":-1,"automation_runs":-1,"connections":-1,"contacts":-1,"members":-1,"storage_gb":250}'],
            ];
            foreach ($plans as [$slug2, $name2, $monthly, $yearly, $limits]) {
                $chk = $pdo->prepare("SELECT id FROM plans WHERE slug = ?");
                $chk->execute([$slug2]);
                if (!$chk->fetch()) {
                    $pdo->prepare("
                        INSERT INTO plans (id, name, slug, price_monthly, price_yearly, limits_json, is_active, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, 1, ?)
                    ")->execute([\App\Support\uuid_v4(), $name2, $slug2, $monthly, $yearly, $limits, $now]);
                }
            }

            success("Account created!");
            success("Email:    {$adminEmail}");
            success("Password: {$adminPassword}");
            success("Workspace: {$workspaceName}");
        }
    } catch (\Throwable $e) {
        error("Failed to create account: " . $e->getMessage());
        warn("You can register via the web UI at {$frontendUrl}/register");
    }
}

// ─── Done ────────────────────────────────────────────────────────────────────

line();
line("\033[1;32m╔══════════════════════════════════════════════════════╗\033[0m");
line("\033[1;32m║          ✓  JidoSapp Setup Complete!                 ║\033[0m");
line("\033[1;32m╚══════════════════════════════════════════════════════╝\033[0m");
line();
success("Configuration saved to: backend/.env");
line();
info("Next steps:");
line("  1. Start the PHP backend:    php -S 0.0.0.0:8000 -t public/");
line("  2. Start the queue worker:   php worker.php");
line("  3. Start the scheduler:      php scheduler.php");
line("  4. Start the frontend:       cd ../frontend && npm run dev");
line();
info("Or use Docker (recommended):");
line("  docker compose up -d");
line();
info("WhatsApp setup (in-app):");
line("  1. Open {$frontendUrl}");
line("  2. Log in with your admin account");
line("  3. Go to Settings → Integrations → WhatsApp");
line("  4. Click 'Connect Account' and enter your:");
line("     • Business Name");
line("     • Phone Number (+country code)");
line("     • Phone Number ID  (from Meta Business Manager)");
line("     • WABA ID          (from Meta Business Manager)");
line("     • Access Token     (Permanent system user token)");
line();
info("Meta webhook config:");
line("  URL:          {$appUrl}/api/webhooks/whatsapp");
line("  Verify Token: " . ($metaVerifyToken ?? 'see .env META_VERIFY_TOKEN'));
line("  Subscribe:    messages");
line();
line("\033[0;33mKeep your .env file private. Never commit it to git.\033[0m");
line();
