<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Database\Connection;
use App\Providers\WhatsApp\MetaWhatsAppProvider;
use App\Queue\JobInterface;
use App\Services\BillingService;
use App\Services\WhatsAppConnectionService;
use PDO;
use function App\Support\current_timestamp;

/**
 * Processes a due scheduled post and sends it via Meta WhatsApp Cloud API.
 *
 * Payload: ['scheduled_post_id' => string, 'workspace_id' => string]
 */
final class ProcessScheduledContentJob implements JobInterface
{
    public function handle(array $payload): void
    {
        $postId      = $payload['scheduled_post_id'] ?? $payload['job_data']['scheduled_post_id'] ?? null;
        $workspaceId = $payload['workspace_id']       ?? null;

        if (!$postId) {
            throw new \InvalidArgumentException("Missing scheduled_post_id in job payload");
        }

        $pdo = Connection::get();
        $now = current_timestamp();

        // Load the scheduled post with content
        $stmt = $pdo->prepare("
            SELECT sp.*, c.content AS message_body, c.title,
                   wc.phone_number_id, wc.access_token_encrypted
            FROM scheduled_posts sp
            JOIN content c ON sp.content_id = c.id
            LEFT JOIN whatsapp_connections wc ON sp.connection_id = wc.id
            WHERE sp.id = ?
        ");
        $stmt->execute([$postId]);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$post) {
            throw new \RuntimeException("Scheduled post not found: {$postId}");
        }

        if ($post['status'] !== 'processing' && $post['status'] !== 'scheduled') {
            return; // Already handled or cancelled
        }

        if (empty($post['access_token_encrypted']) || empty($post['phone_number_id'])) {
            $this->markFailed($pdo, $postId, "No WhatsApp connection configured for this post", $now);
            return;
        }

        try {
            // Decrypt access token
            $connService = new WhatsAppConnectionService();
            $accessToken = $connService->getDecryptedToken($post['connection_id']);
            $appSecret   = getenv('META_APP_SECRET') ?: '';

            $provider = new MetaWhatsAppProvider($accessToken, $post['phone_number_id'], $appSecret);

            // Determine recipients
            $recipients = $this->resolveRecipients($pdo, $post);

            if (empty($recipients)) {
                $this->markFailed($pdo, $postId, "No valid recipients found", $now);
                return;
            }

            $successCount = 0;
            $failCount    = 0;
            $lastError    = null;

            foreach ($recipients as $phone) {
                $result = $provider->sendTextMessage($phone, $post['message_body']);
                if ($result->success) {
                    $successCount++;
                } else {
                    $failCount++;
                    $lastError = $result->errorMessage;
                }
            }

            if ($successCount > 0) {
                // Mark sent and update next_run_at for recurring
                $nextRun = $this->calcNextRun($post);
                if ($nextRun && $post['schedule_type'] === 'recurring') {
                    $upd = $pdo->prepare("
                        UPDATE scheduled_posts
                        SET status = 'scheduled', last_run_at = ?, next_run_at = ?, updated_at = ?
                        WHERE id = ?
                    ");
                    $upd->execute([$now, $nextRun, $now, $postId]);

                    // Mark content as sent
                    $pdo->prepare("UPDATE content SET status = 'sent', updated_at = ? WHERE id = ?")->execute([$now, $post['content_id']]);
                } else {
                    $this->markSent($pdo, $postId, $now, $post['content_id']);
                }

                // Track usage
                if ($workspaceId || $post['workspace_id']) {
                    $ws = $workspaceId ?? $post['workspace_id'];
                    (new BillingService())->trackUsage($ws, 'messages_sent', $successCount);
                }
            } else {
                $this->markFailed($pdo, $postId, $lastError ?? "All sends failed", $now);
            }

        } catch (\Throwable $e) {
            $this->markFailed($pdo, $postId, $e->getMessage(), $now);
            throw $e; // Rethrow for queue retry logic
        }
    }

    private function resolveRecipients(PDO $pdo, array $post): array
    {
        $recipientType = $post['recipient_type'] ?? 'broadcast';

        if ($recipientType === 'contact' && !empty($post['target_recipient'])) {
            return [$post['target_recipient']];
        }

        if ($recipientType === 'broadcast') {
            // Send to all active contacts in workspace
            $stmt = $pdo->prepare("
                SELECT phone FROM contacts
                WHERE workspace_id = ? AND status = 'active'
                LIMIT 1000
            ");
            $stmt->execute([$post['workspace_id']]);
            return $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];
        }

        if (!empty($post['target_recipient'])) {
            return [$post['target_recipient']];
        }

        return [];
    }

    private function calcNextRun(array $post): ?string
    {
        if ($post['schedule_type'] !== 'recurring' || empty($post['recurrence_rule'])) {
            return null;
        }

        // Simple daily recurrence — full RRULE parser would be added in production
        $lastRun = $post['last_run_at'] ?? $post['next_run_at'];
        if (!$lastRun) return null;

        // Default: add 24 hours
        return date('Y-m-d H:i:s', strtotime($lastRun) + 86400);
    }

    private function markSent(PDO $pdo, string $postId, string $now, string $contentId): void
    {
        $pdo->prepare("UPDATE scheduled_posts SET status = 'sent', last_run_at = ?, updated_at = ? WHERE id = ?")
            ->execute([$now, $now, $postId]);
        $pdo->prepare("UPDATE content SET status = 'sent', updated_at = ? WHERE id = ?")
            ->execute([$now, $contentId]);
    }

    private function markFailed(PDO $pdo, string $postId, string $error, string $now): void
    {
        $pdo->prepare("
            UPDATE scheduled_posts SET status = 'failed', error_message = ?, last_run_at = ?, updated_at = ? WHERE id = ?
        ")->execute([$error, $now, $now, $postId]);
        echo "[Job] Scheduled post {$postId} failed: {$error}\n";
    }
}
