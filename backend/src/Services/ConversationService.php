<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use PDO;
use RuntimeException;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class ConversationService
{
    public function list(string $workspaceId, array $filters = []): array
    {
        $pdo    = Connection::get();
        $where  = ['conv.workspace_id = ?'];
        $params = [$workspaceId];

        if (!empty($filters['status'])) {
            $where[] = "conv.status = ?";
            $params[] = $filters['status'];
        }

        if (!empty($filters['handler_mode'])) {
            $where[] = "conv.handler_mode = ?";
            $params[] = $filters['handler_mode'];
        }

        if (!empty($filters['search'])) {
            $where[]  = "(cont.name ILIKE ? OR cont.phone ILIKE ?)";
            $term     = '%' . $filters['search'] . '%';
            $params[] = $term;
            $params[] = $term;
        }

        if (isset($filters['unread_only']) && $filters['unread_only']) {
            $where[] = "conv.unread_count > 0";
        }

        $page   = max(1, (int)($filters['page'] ?? 1));
        $limit  = min(100, max(1, (int)($filters['limit'] ?? 30)));
        $offset = ($page - 1) * $limit;

        $whereSQL = implode(' AND ', $where);

        $countStmt = $pdo->prepare("
            SELECT COUNT(*) FROM conversations conv
            JOIN contacts cont ON conv.contact_id = cont.id
            WHERE {$whereSQL}
        ");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $stmt = $pdo->prepare("
            SELECT conv.*,
                   cont.name   AS contact_name,
                   cont.phone  AS contact_phone,
                   cont.avatar_url AS contact_avatar,
                   lm.content  AS last_message_content,
                   lm.type     AS last_message_type,
                   lm.direction AS last_message_direction,
                   u.name      AS assigned_user_name
            FROM conversations conv
            JOIN contacts cont ON conv.contact_id = cont.id
            LEFT JOIN messages lm ON lm.conversation_id = conv.id
                AND lm.created_at = (SELECT MAX(m2.created_at) FROM messages m2 WHERE m2.conversation_id = conv.id)
            LEFT JOIN users u ON conv.assigned_user_id = u.id
            WHERE {$whereSQL}
            ORDER BY conv.last_message_at DESC NULLS LAST
            LIMIT ? OFFSET ?
        ");
        $params[] = $limit;
        $params[] = $offset;
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'data' => $rows,
            'meta' => ['total' => $total, 'page' => $page, 'limit' => $limit, 'pages' => (int) ceil($total / $limit)],
        ];
    }

    public function get(string $workspaceId, string $conversationId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT conv.*,
                   cont.name   AS contact_name,
                   cont.phone  AS contact_phone,
                   cont.email  AS contact_email,
                   cont.company AS contact_company,
                   cont.avatar_url AS contact_avatar,
                   cont.status AS contact_status,
                   u.name      AS assigned_user_name
            FROM conversations conv
            JOIN contacts cont ON conv.contact_id = cont.id
            LEFT JOIN users u ON conv.assigned_user_id = u.id
            WHERE conv.id = ? AND conv.workspace_id = ?
        ");
        $stmt->execute([$conversationId, $workspaceId]);
        $conv = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$conv) {
            throw new RuntimeException("Conversation not found", 404);
        }

        return $conv;
    }

    public function getMessages(string $workspaceId, string $conversationId, int $page = 1, int $limit = 50): array
    {
        $pdo    = Connection::get();
        $offset = ($page - 1) * $limit;

        // Verify conversation belongs to workspace
        $check = $pdo->prepare("SELECT id FROM conversations WHERE id = ? AND workspace_id = ?");
        $check->execute([$conversationId, $workspaceId]);
        if (!$check->fetch()) {
            throw new RuntimeException("Conversation not found", 404);
        }

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM messages WHERE conversation_id = ? AND workspace_id = ?");
        $countStmt->execute([$conversationId, $workspaceId]);
        $total = (int) $countStmt->fetchColumn();

        $stmt = $pdo->prepare("
            SELECT m.*,
                COALESCE(
                    json_agg(jsonb_build_object('id', ma.id, 'file_name', ma.file_name, 'file_url', ma.file_url, 'file_type', ma.file_type))
                    FILTER (WHERE ma.id IS NOT NULL), '[]'
                ) AS attachments
            FROM messages m
            LEFT JOIN message_attachments ma ON m.id = ma.message_id
            WHERE m.conversation_id = ? AND m.workspace_id = ?
            GROUP BY m.id
            ORDER BY m.created_at ASC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$conversationId, $workspaceId, $limit, $offset]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as &$row) {
            $row['attachments'] = json_decode($row['attachments'] ?? '[]', true);
            if ($row['metadata']) {
                $row['metadata'] = json_decode($row['metadata'], true);
            }
        }

        // Mark as read
        $readStmt = $pdo->prepare("UPDATE conversations SET unread_count = 0 WHERE id = ? AND workspace_id = ?");
        $readStmt->execute([$conversationId, $workspaceId]);

        return [
            'data' => $rows,
            'meta' => ['total' => $total, 'page' => $page, 'limit' => $limit],
        ];
    }

    public function sendMessage(string $workspaceId, string $conversationId, string $content, string $type = 'text'): array
    {
        $pdo = Connection::get();

        // Get conversation and connection
        $stmt = $pdo->prepare("
            SELECT conv.*, cont.phone AS contact_phone, wc.id AS connection_id
            FROM conversations conv
            JOIN contacts cont ON conv.contact_id = cont.id
            LEFT JOIN whatsapp_connections wc ON conv.connection_id = wc.id
            WHERE conv.id = ? AND conv.workspace_id = ?
        ");
        $stmt->execute([$conversationId, $workspaceId]);
        $conv = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$conv) {
            throw new RuntimeException("Conversation not found", 404);
        }

        $msgId = uuid_v4();
        $now   = current_timestamp();

        // Create message as queued initially
        $ins = $pdo->prepare("
            INSERT INTO messages (id, workspace_id, conversation_id, direction, type, content, status, recipient, created_at)
            VALUES (?, ?, ?, 'outbound', ?, ?, 'queued', ?, ?)
        ");
        $ins->execute([$msgId, $workspaceId, $conversationId, $type, $content, $conv['contact_phone'], $now]);

        // Update conversation timestamp
        $updConv = $pdo->prepare("UPDATE conversations SET last_message_at = ?, updated_at = ? WHERE id = ?");
        $updConv->execute([$now, $now, $conversationId]);

        // Queue for actual WhatsApp delivery via worker
        $this->queueMessageJob($workspaceId, $msgId, $conv['connection_id'], $conv['contact_phone'], $content, $type);

        return $this->getMessageById($workspaceId, $msgId);
    }

    public function addNote(string $workspaceId, string $conversationId, string $content, string $userId): array
    {
        $pdo = Connection::get();
        $id  = uuid_v4();
        $now = current_timestamp();

        $stmt = $pdo->prepare("
            INSERT INTO messages (id, workspace_id, conversation_id, direction, type, content, status, sender, created_at)
            VALUES (?, ?, ?, 'outbound', 'note', ?, 'sent', ?, ?)
        ");
        $stmt->execute([$id, $workspaceId, $conversationId, $content, $userId, $now]);

        return $this->getMessageById($workspaceId, $id);
    }

    public function updateStatus(string $workspaceId, string $conversationId, string $status): array
    {
        $valid = ['open', 'resolved', 'pending'];
        if (!in_array($status, $valid, true)) {
            throw new RuntimeException("Invalid status", 422);
        }

        $pdo = Connection::get();
        $upd = $pdo->prepare("UPDATE conversations SET status = ?, updated_at = ? WHERE id = ? AND workspace_id = ?");
        $upd->execute([$status, current_timestamp(), $conversationId, $workspaceId]);
        return $this->get($workspaceId, $conversationId);
    }

    public function updateHandlerMode(string $workspaceId, string $conversationId, string $mode): array
    {
        $valid = ['ai', 'human', 'hybrid'];
        if (!in_array($mode, $valid, true)) {
            throw new RuntimeException("Invalid handler mode", 422);
        }

        $pdo = Connection::get();
        $upd = $pdo->prepare("UPDATE conversations SET handler_mode = ?, updated_at = ? WHERE id = ? AND workspace_id = ?");
        $upd->execute([$mode, current_timestamp(), $conversationId, $workspaceId]);
        return $this->get($workspaceId, $conversationId);
    }

    public function assign(string $workspaceId, string $conversationId, ?string $userId): array
    {
        $pdo = Connection::get();
        $upd = $pdo->prepare("UPDATE conversations SET assigned_user_id = ?, updated_at = ? WHERE id = ? AND workspace_id = ?");
        $upd->execute([$userId, current_timestamp(), $conversationId, $workspaceId]);
        return $this->get($workspaceId, $conversationId);
    }

    private function getMessageById(string $workspaceId, string $messageId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("SELECT * FROM messages WHERE id = ? AND workspace_id = ?");
        $stmt->execute([$messageId, $workspaceId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
    }

    private function queueMessageJob(string $workspaceId, string $messageId, ?string $connectionId, string $phone, string $content, string $type): void
    {
        try {
            $payload = json_encode([
                'job'           => 'SendWhatsAppMessage',
                'workspace_id'  => $workspaceId,
                'message_id'    => $messageId,
                'connection_id' => $connectionId,
                'phone'         => $phone,
                'content'       => $content,
                'type'          => $type,
                'queued_at'     => time(),
            ]);

            $redis = new \Redis();
            $redis->connect(
                getenv('REDIS_HOST') ?: '127.0.0.1',
                (int)(getenv('REDIS_PORT') ?: 6379)
            );
            $redis->rPush('jidosapp:queue:default', $payload);
        } catch (\Throwable) {
            // Redis not available — message stays as queued in DB, worker will pick it up
        }
    }
}
