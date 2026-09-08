<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use PDO;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class NotificationService
{
    public static function send(
        string  $workspaceId,
        string  $type,
        string  $title,
        string  $message,
        ?string $userId = null,
        ?string $link = null
    ): void {
        try {
            $pdo  = Connection::get();
            $id   = uuid_v4();
            $now  = current_timestamp();
            $stmt = $pdo->prepare("
                INSERT INTO notifications (id, workspace_id, user_id, type, title, message, link, is_read, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
            ");
            $stmt->execute([$id, $workspaceId, $userId, $type, $title, $message, $link, $now]);
        } catch (\Throwable) {
            // Non-critical — never let notification failure break main flow
        }
    }

    public function getForUser(string $workspaceId, string $userId, bool $unreadOnly = false): array
    {
        $pdo   = Connection::get();
        $where = "workspace_id = ? AND (user_id = ? OR user_id IS NULL)";
        $params = [$workspaceId, $userId];

        if ($unreadOnly) {
            $where  .= " AND is_read = 0";
        }

        $stmt = $pdo->prepare("
            SELECT * FROM notifications
            WHERE {$where}
            ORDER BY created_at DESC
            LIMIT 50
        ");
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function markRead(string $workspaceId, string $userId, ?string $notificationId = null): void
    {
        $pdo = Connection::get();
        if ($notificationId) {
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND workspace_id = ?");
            $stmt->execute([$notificationId, $workspaceId]);
        } else {
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE workspace_id = ? AND (user_id = ? OR user_id IS NULL)");
            $stmt->execute([$workspaceId, $userId]);
        }
    }

    public function getUnreadCount(string $workspaceId, string $userId): int
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM notifications
            WHERE workspace_id = ? AND (user_id = ? OR user_id IS NULL) AND is_read = 0
        ");
        $stmt->execute([$workspaceId, $userId]);
        return (int) $stmt->fetchColumn();
    }
}
