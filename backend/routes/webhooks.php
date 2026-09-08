<?php

declare(strict_types=1);

use App\Controllers\BillingController;
use App\Database\Connection;
use App\Providers\WhatsApp\MetaWhatsAppProvider;
use App\Routing\Router;
use App\Services\WhatsAppConnectionService;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

/** @var Router $router */

// ──────────────────────────────────────────────────────────────
// WhatsApp Meta Webhook — Verification (GET)
// ──────────────────────────────────────────────────────────────
$router->get('/api/webhooks/whatsapp', function ($req, $res) {
    $mode      = $req->query('hub_mode');
    $token     = $req->query('hub_verify_token');
    $challenge = $req->query('hub_challenge');

    if ($mode !== 'subscribe' || empty($token) || empty($challenge)) {
        $res->error('BAD_REQUEST', 'Invalid webhook verification request', 400)->send();
        return;
    }

    // Look up workspace by verify token
    try {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("SELECT id FROM whatsapp_connections WHERE webhook_verify_token = ? AND status = 'connected'");
        $stmt->execute([$token]);
        $conn = $stmt->fetch();

        if (!$conn) {
            $res->error('FORBIDDEN', 'Invalid verify token', 403)->send();
            return;
        }

        // Return the challenge to verify the endpoint
        http_response_code(200);
        echo $challenge;
    } catch (\Throwable $e) {
        $res->error('SERVER_ERROR', 'Webhook verification failed', 500)->send();
    }
});

// ──────────────────────────────────────────────────────────────
// WhatsApp Meta Webhook — Receive Events (POST)
// ──────────────────────────────────────────────────────────────
$router->post('/api/webhooks/whatsapp', function ($req, $res) {
    $rawBody   = file_get_contents('php://input') ?: '';
    $signature = $req->header('x-hub-signature-256') ?? '';
    $payload   = json_decode($rawBody, true) ?? [];

    if (empty($payload)) {
        $res->error('BAD_REQUEST', 'Empty or invalid payload', 400)->send();
        return;
    }

    // Determine which connection this belongs to (via phone_number_id)
    $phoneNumberId = null;
    foreach ($payload['entry'] ?? [] as $entry) {
        foreach ($entry['changes'] ?? [] as $change) {
            $phoneNumberId = $change['value']['metadata']['phone_number_id'] ?? null;
            if ($phoneNumberId) break 2;
        }
    }

    if (!$phoneNumberId) {
        // Acknowledge Meta even if we cannot route
        $res->json(['status' => 'ignored'])->send();
        return;
    }

    try {
        $connService = new WhatsAppConnectionService();
        $conn        = $connService->getConnectionByPhoneNumberId($phoneNumberId);

        if (!$conn) {
            $res->json(['status' => 'unknown_connection'])->send();
            return;
        }

        $workspaceId = $conn['workspace_id'];
        $connId      = $conn['id'];

        // Verify webhook signature using the app secret
        $appSecret = getenv('META_APP_SECRET') ?: '';
        if (!empty($appSecret) && !empty($signature)) {
            $expected = 'sha256=' . hash_hmac('sha256', $rawBody, $appSecret);
            if (!hash_equals($expected, $signature)) {
                $res->error('FORBIDDEN', 'Invalid webhook signature', 403)->send();
                return;
            }
        }

        // Store the raw webhook event for audit/debugging
        $pdo    = Connection::get();
        $evtId  = uuid_v4();
        $now    = current_timestamp();
        $evtType = $payload['object'] ?? 'whatsapp_business_account';

        $evtStmt = $pdo->prepare("
            INSERT INTO whatsapp_webhook_events
                (id, workspace_id, connection_id, event_type, payload, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'received', ?)
        ");
        $evtStmt->execute([$evtId, $workspaceId, $connId, $evtType, $rawBody, $now]);

        // Parse normalized events
        $accessToken = $connService->getDecryptedToken($connId);
        $provider    = new MetaWhatsAppProvider($accessToken, $phoneNumberId, $appSecret);
        $events      = $provider->parseWebhookPayload($payload);

        // Process each normalized event
        foreach ($events as $event) {
            if ($event['type'] === 'message') {
                handleIncomingMessage($workspaceId, $connId, $event, $pdo, $now);
            } elseif ($event['type'] === 'status') {
                handleStatusUpdate($event, $pdo, $now);
            }
        }

        // Mark webhook event as processed
        $updEvt = $pdo->prepare("UPDATE whatsapp_webhook_events SET status = 'processed', processed_at = ? WHERE id = ?");
        $updEvt->execute([$now, $evtId]);

        // Always respond 200 promptly to Meta
        $res->json(['status' => 'ok'])->send();

    } catch (\Throwable $e) {
        // Log error but still return 200 to prevent Meta from retrying
        error_log('WhatsApp webhook error: ' . $e->getMessage());
        $res->json(['status' => 'error'])->send();
    }
});

function handleIncomingMessage(string $workspaceId, string $connId, array $event, \PDO $pdo, string $now): void
{
    $from        = $event['from'] ?? '';
    $externalId  = $event['message_id'] ?? '';
    $msgType     = $event['message_type'] ?? 'text';
    $textContent = $event['text'] ?? null;
    $contactInfo = $event['contacts'][0] ?? [];
    $contactName = $contactInfo['profile']['name'] ?? $from;

    if (empty($from)) return;

    // Find or create contact
    $contStmt = $pdo->prepare("SELECT id FROM contacts WHERE workspace_id = ? AND phone = ? LIMIT 1");
    $contStmt->execute([$workspaceId, $from]);
    $contactId = $contStmt->fetchColumn();

    if (!$contactId) {
        $contactId = uuid_v4();
        $ins = $pdo->prepare("
            INSERT INTO contacts (id, workspace_id, name, phone, source, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'whatsapp', 'active', ?, ?)
        ");
        $ins->execute([$contactId, $workspaceId, $contactName, $from, $now, $now]);
    }

    // Find or create conversation
    $convStmt = $pdo->prepare("
        SELECT id FROM conversations
        WHERE workspace_id = ? AND contact_id = ? AND status != 'resolved'
        ORDER BY last_message_at DESC LIMIT 1
    ");
    $convStmt->execute([$workspaceId, $contactId]);
    $convId = $convStmt->fetchColumn();

    if (!$convId) {
        $convId = uuid_v4();
        $ins = $pdo->prepare("
            INSERT INTO conversations
                (id, workspace_id, contact_id, connection_id, status, handler_mode, last_message_at, unread_count, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'open', 'ai', ?, 1, ?, ?)
        ");
        $ins->execute([$convId, $workspaceId, $contactId, $connId, $now, $now, $now]);
    } else {
        // Increment unread count
        $upd = $pdo->prepare("UPDATE conversations SET unread_count = unread_count + 1, last_message_at = ?, updated_at = ? WHERE id = ?");
        $upd->execute([$now, $now, $convId]);
    }

    // Check for duplicate message
    if (!empty($externalId)) {
        $dupStmt = $pdo->prepare("SELECT id FROM messages WHERE external_message_id = ?");
        $dupStmt->execute([$externalId]);
        if ($dupStmt->fetchColumn()) return; // Already stored
    }

    // Store message
    $msgId = uuid_v4();
    $ins   = $pdo->prepare("
        INSERT INTO messages
            (id, workspace_id, conversation_id, external_message_id, direction, type, content, status, sender, created_at)
        VALUES (?, ?, ?, ?, 'inbound', ?, ?, 'received', ?, ?)
    ");
    $ins->execute([
        $msgId, $workspaceId, $convId, $externalId,
        $msgType, $textContent, $from, $now,
    ]);

    // Queue AI processing job
    try {
        $redisPayload = json_encode([
            'job'             => 'ProcessIncomingMessage',
            'workspace_id'    => $workspaceId,
            'conversation_id' => $convId,
            'message_id'      => $msgId,
            'connection_id'   => $connId,
            'queued_at'       => time(),
        ]);

        $redis = new \Redis();
        $redis->connect(
            getenv('REDIS_HOST') ?: '127.0.0.1',
            (int)(getenv('REDIS_PORT') ?: 6379)
        );
        $redis->rPush('jidosapp:queue:default', $redisPayload);
    } catch (\Throwable) {
        // Redis unavailable — message stored, AI processing deferred
    }
}

function handleStatusUpdate(array $event, \PDO $pdo, string $now): void
{
    $externalId = $event['message_id'] ?? '';
    $status     = $event['status'] ?? '';

    if (empty($externalId) || empty($status)) return;

    // Map Meta status to our status
    $statusMap = [
        'sent'      => 'sent',
        'delivered' => 'delivered',
        'read'      => 'read',
        'failed'    => 'failed',
    ];

    $dbStatus = $statusMap[$status] ?? null;
    if (!$dbStatus) return;

    $upd = $pdo->prepare("
        UPDATE messages SET status = ? WHERE external_message_id = ?
    ");
    $upd->execute([$dbStatus, $externalId]);
}

// ──────────────────────────────────────────────────────────────
// Stripe Webhook
// ──────────────────────────────────────────────────────────────
$router->post('/api/webhooks/stripe', [BillingController::class, 'stripeWebhook']);
