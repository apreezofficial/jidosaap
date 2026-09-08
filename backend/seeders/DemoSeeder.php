<?php

declare(strict_types=1);

namespace App\Seeders;

use App\Database\Connection;
use App\Security\PasswordHasher;
use App\Security\EncryptionService;
use PDO;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class DemoSeeder
{
    public function run(): array
    {
        $pdo = Connection::get();
        $now = current_timestamp();

        return Connection::transaction(function (PDO $pdo) use ($now) {
            // 1. Seed Plans
            $plans = [
                ['id' => uuid_v4(), 'name' => 'Starter', 'slug' => 'starter', 'monthly' => 15.00, 'yearly' => 144.00, 'limits' => '{"connections":1,"messages":1000,"agents":1,"automations":5}'],
                ['id' => uuid_v4(), 'name' => 'Business', 'slug' => 'business', 'monthly' => 39.00, 'yearly' => 372.00, 'limits' => '{"connections":2,"messages":5000,"agents":3,"automations":-1}'],
                ['id' => uuid_v4(), 'name' => 'Pro', 'slug' => 'pro', 'monthly' => 99.00, 'yearly' => 948.00, 'limits' => '{"connections":5,"messages":25000,"agents":10,"automations":-1}'],
                ['id' => uuid_v4(), 'name' => 'Agency', 'slug' => 'agency', 'monthly' => 249.00, 'yearly' => 2388.00, 'limits' => '{"connections":-1,"messages":100000,"agents":-1,"automations":-1}'],
            ];

            foreach ($plans as $p) {
                $check = $pdo->prepare("SELECT id FROM plans WHERE slug = ?");
                $check->execute([$p['slug']]);
                if (!$check->fetch()) {
                    $stmt = $pdo->prepare("
                        INSERT INTO plans (id, name, slug, price_monthly, price_yearly, limits_json, is_active, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, 1, ?)
                    ");
                    $stmt->execute([$p['id'], $p['name'], $p['slug'], $p['monthly'], $p['yearly'], $p['limits'], $now]);
                }
            }

            // 2. Demo User
            $demoEmail = 'demo@jidosapp.io';
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$demoEmail]);
            $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($existingUser) {
                $userId = $existingUser['id'];
            } else {
                $userId = uuid_v4();
                $passHash = PasswordHasher::hash('JidoDemoPass2026!');
                $userStmt = $pdo->prepare("
                    INSERT INTO users (id, name, email, password_hash, status, email_verified_at, created_at, updated_at)
                    VALUES (?, 'Kenji Sato', ?, ?, 'active', ?, ?, ?)
                ");
                $userStmt->execute([$userId, $demoEmail, $passHash, $now, $now, $now]);
            }

            // 3. Demo Workspace
            $demoWsSlug = 'tokyo-retail-demo';
            $stmtWs = $pdo->prepare("SELECT id FROM workspaces WHERE slug = ?");
            $stmtWs->execute([$demoWsSlug]);
            $existingWs = $stmtWs->fetch(PDO::FETCH_ASSOC);

            if ($existingWs) {
                $wsId = $existingWs['id'];
            } else {
                $wsId = uuid_v4();
                $insertWs = $pdo->prepare("
                    INSERT INTO workspaces (id, name, slug, timezone, currency, business_type, created_by, created_at, updated_at)
                    VALUES (?, 'Tokyo Retail (Demo)', ?, 'UTC', 'USD', 'ecommerce', ?, ?, ?)
                ");
                $insertWs->execute([$wsId, $demoWsSlug, $userId, $now, $now]);

                // Add Member
                $pdo->prepare("
                    INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at, updated_at)
                    VALUES (?, ?, ?, 'owner', ?, ?)
                ")->execute([uuid_v4(), $wsId, $userId, $now, $now]);

                // Subscribe to Business plan
                $planId = $pdo->query("SELECT id FROM plans WHERE slug = 'business'")->fetchColumn();
                if ($planId) {
                    $pdo->prepare("
                        INSERT INTO subscriptions (id, workspace_id, plan_id, status, current_period_start, current_period_end, created_at, updated_at)
                        VALUES (?, ?, ?, 'active', ?, ?, ?, ?)
                    ")->execute([uuid_v4(), $wsId, $planId, $now, date('Y-m-d H:i:s', strtotime('+30 days')), $now, $now]);
                }
            }

            // 4. Demo WhatsApp Connection
            $connId = uuid_v4();
            $checkConn = $pdo->prepare("SELECT id FROM whatsapp_connections WHERE workspace_id = ?");
            $checkConn->execute([$wsId]);
            if (!$checkConn->fetch()) {
                $encryptedToken = EncryptionService::encrypt('EAAX_DEMO_META_TOKEN_OFFICIAL_CLOUD_API');
                $pdo->prepare("
                    INSERT INTO whatsapp_connections (id, workspace_id, business_name, phone_number, phone_number_id, waba_id, access_token_encrypted, webhook_verify_token, status, connected_at, last_active_at, created_at, updated_at)
                    VALUES (?, ?, 'Tokyo Retail Flagship', '+15550198372', '109823487192837', '9827361524312', ?, 'jidosapp_meta_verify_token', 'connected', ?, ?, ?, ?)
                ")->execute([$connId, $wsId, $encryptedToken, $now, $now, $now, $now]);
            } else {
                $connId = $checkConn->fetchColumn();
            }

            // 5. Demo Contacts & Conversations
            $contactsData = [
                ['name' => 'Sophia Lin', 'phone' => '+15552348901', 'email' => 'sophia.lin@gmail.com', 'stage' => 'qualified', 'value' => 1250.00],
                ['name' => 'Marcus Vance', 'phone' => '+15558912345', 'email' => 'marcus@vancetech.io', 'stage' => 'proposal', 'value' => 4500.00],
                ['name' => 'Elena Rostova', 'phone' => '+15556781234', 'email' => 'elena@rostova.de', 'stage' => 'new', 'value' => 800.00],
            ];

            foreach ($contactsData as $c) {
                $checkContact = $pdo->prepare("SELECT id FROM contacts WHERE workspace_id = ? AND phone = ?");
                $checkContact->execute([$wsId, $c['phone']]);
                $cId = $checkContact->fetchColumn();

                if (!$cId) {
                    $cId = uuid_v4();
                    $pdo->prepare("
                        INSERT INTO contacts (id, workspace_id, name, phone, email, source, status, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, 'whatsapp', 'customer', ?, ?)
                    ")->execute([$cId, $wsId, $c['name'], $c['phone'], $c['email'], $now, $now]);

                    // Lead
                    $leadId = uuid_v4();
                    $pdo->prepare("
                        INSERT INTO leads (id, workspace_id, contact_id, title, value, currency, stage, source, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, 'USD', ?, 'whatsapp', ?, ?)
                    ")->execute([$leadId, $wsId, $cId, "WhatsApp Opportunity — {$c['name']}", $c['value'], $c['stage'], $now, $now]);

                    // Conversation
                    $convId = uuid_v4();
                    $pdo->prepare("
                        INSERT INTO conversations (id, workspace_id, contact_id, connection_id, status, handler_mode, last_message_at, unread_count, priority, created_at, updated_at)
                        VALUES (?, ?, ?, ?, 'open', 'ai', ?, 0, 'medium', ?, ?)
                    ")->execute([$convId, $wsId, $cId, $connId, $now, $now, $now]);

                    // Message 1: Inbound customer inquiry
                    $m1Id = uuid_v4();
                    $pdo->prepare("
                        INSERT INTO messages (id, workspace_id, conversation_id, external_message_id, direction, type, content, status, sender, recipient, created_at)
                        VALUES (?, ?, ?, ?, 'inbound', 'text', 'Hello! Could you tell me if the artisan teapot is currently in stock?', 'delivered', ?, 'business', ?)
                    ")->execute([$m1Id, $wsId, $convId, 'wamid_' . bin2hex(random_bytes(8)), $c['phone'], $now]);

                    // Message 2: Outbound AI reply
                    $m2Id = uuid_v4();
                    $pdo->prepare("
                        INSERT INTO messages (id, workspace_id, conversation_id, external_message_id, direction, type, content, status, sender, recipient, created_at)
                        VALUES (?, ?, ?, ?, 'outbound', 'text', 'Hi Sophia! Yes, we have 4 handcrafted artisan teapots left in inventory at $120. Would you like me to reserve one for you?', 'read', 'business', ?, ?)
                    ")->execute([$m2Id, $wsId, $convId, 'wamid_' . bin2hex(random_bytes(8)), $c['phone'], $now]);
                }
            }

            // 6. Demo AI Agent
            $checkAgent = $pdo->prepare("SELECT id FROM ai_agents WHERE workspace_id = ?");
            $checkAgent->execute([$wsId]);
            if (!$checkAgent->fetch()) {
                $agentId = uuid_v4();
                $pdo->prepare("
                    INSERT INTO ai_agents (id, workspace_id, name, description, personality, tone, language, instructions, is_active, created_at, updated_at)
                    VALUES (?, ?, 'Tokyo Concierge AI', 'Primary sales & support automated agent', 'Polite, accurate, and concise Japanese hospitality style', 'professional', 'en', 'Help customers discover luxury retail products, check inventory, qualify potential wholesale leads, and answer FAQs. Escalate to human if refund or custom order is requested.', 1, ?, ?)
                ")->execute([$agentId, $wsId, $now, $now]);
            }

            return [
                'demo_user'      => $demoEmail,
                'demo_password'  => 'JidoDemoPass2026!',
                'workspace_slug' => $demoWsSlug,
            ];
        });
    }
}
