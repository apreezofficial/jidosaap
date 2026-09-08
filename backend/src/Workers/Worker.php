<?php

declare(strict_types=1);

namespace App\Workers;

use App\Database\Connection;
use App\Services\AiService;
use App\Services\BillingService;
use App\Services\WhatsAppConnectionService;
use App\Providers\WhatsApp\MetaWhatsAppProvider;
use PDO;

/**
 * JidoSapp Queue Worker
 *
 * Processes jobs from Redis queue (or falls back to DB queue).
 * Run via: php worker.php
 *
 * Jobs:
 *   - SendWhatsAppMessage
 *   - ProcessIncomingMessage
 *   - ProcessDocument
 *   - ProcessScheduledContent
 */
final class Worker
{
    private bool $running = true;
    private int  $sleep;
    private int  $maxTries;
    private string $queue;

    public function __construct()
    {
        $this->sleep    = (int)(getenv('WORKER_SLEEP')     ?: 3);
        $this->maxTries = (int)(getenv('WORKER_MAX_TRIES') ?: 3);
        $this->queue    = getenv('WORKER_QUEUE') ?: 'jidosapp:queue:default';
    }

    public function run(): void
    {
        echo "[Worker] JidoSapp Queue Worker started. Queue: {$this->queue}\n";
        echo "[Worker] Press Ctrl+C to stop.\n\n";

        // Handle graceful shutdown
        if (function_exists('pcntl_signal')) {
            pcntl_signal(SIGTERM, function () { $this->running = false; });
            pcntl_signal(SIGINT,  function () { $this->running = false; });
        }

        while ($this->running) {
            if (function_exists('pcntl_signal_dispatch')) {
                pcntl_signal_dispatch();
            }

            $job = $this->fetchNextJob();

            if ($job === null) {
                sleep($this->sleep);
                continue;
            }

            $this->processJob($job);
        }

        echo "[Worker] Shutting down gracefully.\n";
    }

    private function fetchNextJob(): ?array
    {
        // Try Redis first
        try {
            $redis = new \Redis();
            $redis->connect(
                getenv('REDIS_HOST') ?: '127.0.0.1',
                (int)(getenv('REDIS_PORT') ?: 6379)
            );
            $raw = $redis->lPop($this->queue);
            if ($raw) {
                return json_decode($raw, true);
            }
            return null;
        } catch (\Throwable $e) {
            // Redis unavailable — fall through to DB queue
        }

        // DB queue fallback
        try {
            $pdo  = Connection::get();
            $stmt = $pdo->prepare("
                SELECT * FROM jobs
                WHERE queue = 'default'
                  AND (reserved_at IS NULL OR reserved_at < NOW() - INTERVAL '5 minutes')
                  AND available_at <= NOW()
                  AND attempts < ?
                ORDER BY created_at ASC
                LIMIT 1
                FOR UPDATE SKIP LOCKED
            ");
            $stmt->execute([$this->maxTries]);
            $job = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$job) return null;

            // Mark as reserved
            $upd = $pdo->prepare("UPDATE jobs SET reserved_at = NOW(), attempts = attempts + 1 WHERE id = ?");
            $upd->execute([$job['id']]);

            return json_decode($job['payload'] ?? '{}', true);
        } catch (\Throwable) {
            return null;
        }
    }

    private function processJob(array $job): void
    {
        $jobType = $job['job'] ?? 'unknown';
        echo "[Worker] Processing job: {$jobType}\n";

        try {
            match ($jobType) {
                'SendWhatsAppMessage'    => $this->handleSendWhatsApp($job),
                'ProcessIncomingMessage' => $this->handleIncomingMessage($job),
                'ProcessDocument'        => $this->handleProcessDocument($job),
                'ProcessScheduledContent'=> $this->handleScheduledContent($job),
                default                  => echo "[Worker] Unknown job type: {$jobType}\n",
            };
            echo "[Worker] ✓ Completed: {$jobType}\n";
        } catch (\Throwable $e) {
            echo "[Worker] ✗ Failed {$jobType}: {$e->getMessage()}\n";
            $this->logFailure($job, $e->getMessage());
        }
    }

    private function handleSendWhatsApp(array $job): void
    {
        $workspaceId = $job['workspace_id'] ?? '';
        $messageId   = $job['message_id']   ?? '';
        $connectionId = $job['connection_id'] ?? '';
        $phone       = $job['phone']         ?? '';
        $content     = $job['content']       ?? '';
        $type        = $job['type']          ?? 'text';

        if (!$connectionId || !$phone || !$content) {
            echo "[Worker] Missing required fields for SendWhatsAppMessage\n";
            return;
        }

        $connService = new WhatsAppConnectionService();
        $conn        = $connService->get($workspaceId, $connectionId);
        $token       = $connService->getDecryptedToken($connectionId);
        $appSecret   = getenv('META_APP_SECRET') ?: '';

        $provider = new MetaWhatsAppProvider($token, $conn['phone_number_id'], $appSecret);
        $result   = $provider->sendTextMessage($phone, $content);

        $pdo = Connection::get();
        if ($result->success) {
            $upd = $pdo->prepare("UPDATE messages SET status = 'sent', external_message_id = ? WHERE id = ?");
            $upd->execute([$result->messageId, $messageId]);

            // Track usage
            (new BillingService())->trackUsage($workspaceId, 'messages_sent');
        } else {
            $upd = $pdo->prepare("UPDATE messages SET status = 'failed', error_message = ? WHERE id = ?");
            $upd->execute([$result->errorMessage, $messageId]);
            echo "[Worker] WhatsApp send failed: {$result->errorMessage}\n";
        }
    }

    private function handleIncomingMessage(array $job): void
    {
        $workspaceId    = $job['workspace_id']    ?? '';
        $conversationId = $job['conversation_id'] ?? '';
        $messageId      = $job['message_id']      ?? '';
        $connectionId   = $job['connection_id']   ?? '';

        if (!$workspaceId || !$conversationId) return;

        $pdo = Connection::get();

        // Check conversation handler mode
        $convStmt = $pdo->prepare("SELECT handler_mode FROM conversations WHERE id = ?");
        $convStmt->execute([$conversationId]);
        $conv = $convStmt->fetch(PDO::FETCH_ASSOC);

        if (!$conv || $conv['handler_mode'] === 'human') {
            // Human mode — no AI processing, just mark as received
            return;
        }

        // Get message content
        $msgStmt = $pdo->prepare("SELECT content FROM messages WHERE id = ?");
        $msgStmt->execute([$messageId]);
        $msg = $msgStmt->fetch(PDO::FETCH_ASSOC);

        if (!$msg || empty($msg['content'])) return;

        try {
            // Classify intent
            $ai = new AiService();
            $intent = $ai->classifyIntent($msg['content']);

            // If requires human, switch handler mode
            if ($intent['requires_human'] ?? false) {
                $upd = $pdo->prepare("UPDATE conversations SET handler_mode = 'human', updated_at = NOW() WHERE id = ?");
                $upd->execute([$conversationId]);
                echo "[Worker] Escalated conversation {$conversationId} to human\n";
                return;
            }

            // Generate AI response
            $connService = new WhatsAppConnectionService();
            $conn        = $connService->get($workspaceId, $connectionId);
            $token       = $connService->getDecryptedToken($connectionId);
            $appSecret   = getenv('META_APP_SECRET') ?: '';

            // Get contact phone from conversation
            $phoneStmt = $pdo->prepare("
                SELECT cont.phone FROM conversations conv
                JOIN contacts cont ON conv.contact_id = cont.id
                WHERE conv.id = ?
            ");
            $phoneStmt->execute([$conversationId]);
            $contactPhone = $phoneStmt->fetchColumn();

            if (!$contactPhone) return;

            $aiResponse = $ai->generate(
                "You are a helpful WhatsApp business assistant. Be concise and professional. Maximum 200 characters.",
                $msg['content']
            );

            // Store AI reply
            $replyId = \App\Support\uuid_v4();
            $now     = \App\Support\current_timestamp();
            $ins = $pdo->prepare("
                INSERT INTO messages (id, workspace_id, conversation_id, direction, type, content, status, sender, recipient, created_at)
                VALUES (?, ?, ?, 'outbound', 'text', ?, 'queued', 'ai', ?, ?)
            ");
            $ins->execute([$replyId, $workspaceId, $conversationId, $aiResponse, $contactPhone, $now]);

            // Send via WhatsApp
            $provider = new MetaWhatsAppProvider($token, $conn['phone_number_id'], $appSecret);
            $result   = $provider->sendTextMessage($contactPhone, $aiResponse);

            if ($result->success) {
                $upd = $pdo->prepare("UPDATE messages SET status = 'sent', external_message_id = ? WHERE id = ?");
                $upd->execute([$result->messageId, $replyId]);
                (new BillingService())->trackUsage($workspaceId, 'messages_sent');
                (new BillingService())->trackUsage($workspaceId, 'ai_requests');
            } else {
                $upd = $pdo->prepare("UPDATE messages SET status = 'failed' WHERE id = ?");
                $upd->execute([$replyId]);
            }
        } catch (\Throwable $e) {
            echo "[Worker] AI processing error: {$e->getMessage()}\n";
        }
    }

    private function handleProcessDocument(array $job): void
    {
        $docId   = $job['document_id']  ?? '';
        $wsId    = $job['workspace_id'] ?? '';
        $fileUrl = $job['file_url']     ?? '';

        if (!$docId) return;

        $pdo = Connection::get();

        try {
            // Download and extract text
            $content = '';
            if (!empty($fileUrl)) {
                $ch = curl_init($fileUrl);
                curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30]);
                $content = (string) curl_exec($ch);
                curl_close($ch);
            }

            if (empty($content)) {
                $upd = $pdo->prepare("UPDATE documents SET status = 'failed', updated_at = NOW() WHERE id = ?");
                $upd->execute([$docId]);
                return;
            }

            // Simple chunking: split into ~500 char chunks
            $chunks    = str_split($content, 500);
            $chunkCount = count($chunks);
            $now        = \App\Support\current_timestamp();

            foreach ($chunks as $idx => $chunk) {
                $chunkId = \App\Support\uuid_v4();
                $ins = $pdo->prepare("
                    INSERT INTO document_chunks (id, document_id, workspace_id, chunk_index, content, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                $ins->execute([$chunkId, $docId, $wsId, $idx, trim($chunk), $now]);
            }

            $upd = $pdo->prepare("UPDATE documents SET status = 'ready', chunk_count = ?, updated_at = NOW() WHERE id = ?");
            $upd->execute([$chunkCount, $docId]);

            echo "[Worker] Document {$docId} processed: {$chunkCount} chunks\n";
        } catch (\Throwable $e) {
            $upd = $pdo->prepare("UPDATE documents SET status = 'failed', updated_at = NOW() WHERE id = ?");
            $upd->execute([$docId]);
            throw $e;
        }
    }

    private function handleScheduledContent(array $job): void
    {
        // Handled by ProcessScheduledContentJob
        $jobHandler = new \App\Jobs\ProcessScheduledContentJob();
        $jobHandler->handle($job);
    }

    private function logFailure(array $job, string $error): void
    {
        try {
            $pdo  = Connection::get();
            $stmt = $pdo->prepare("
                INSERT INTO failed_jobs (id, connection, payload, exception, failed_at)
                VALUES (?, 'redis', ?, ?, NOW())
            ");
            $stmt->execute([\App\Support\uuid_v4(), json_encode($job), $error]);
        } catch (\Throwable) {
            // Ignore
        }
    }
}
