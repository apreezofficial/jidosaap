<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use PDO;
use RuntimeException;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class ContentService
{
    public function list(string $workspaceId, array $filters = []): array
    {
        $pdo    = Connection::get();
        $where  = ['c.workspace_id = ?'];
        $params = [$workspaceId];

        if (!empty($filters['status'])) {
            $where[]  = "c.status = ?";
            $params[] = $filters['status'];
        }

        if (!empty($filters['search'])) {
            $where[]  = "c.title ILIKE ?";
            $params[] = '%' . $filters['search'] . '%';
        }

        $page   = max(1, (int)($filters['page'] ?? 1));
        $limit  = min(100, max(1, (int)($filters['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;
        $whereSQL = implode(' AND ', $where);

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM content c WHERE {$whereSQL}");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $stmt = $pdo->prepare("
            SELECT c.*,
                u.name AS created_by_name,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object('id', cm.id, 'media_type', cm.media_type, 'media_url', cm.media_url, 'caption', cm.caption))
                    FILTER (WHERE cm.id IS NOT NULL), '[]'
                ) AS media,
                sp.next_run_at,
                sp.schedule_type,
                sp.status AS schedule_status,
                sp.id AS scheduled_post_id
            FROM content c
            LEFT JOIN users u ON c.created_by = u.id
            LEFT JOIN content_media cm ON c.id = cm.content_id
            LEFT JOIN scheduled_posts sp ON c.id = sp.content_id AND sp.workspace_id = c.workspace_id
            WHERE {$whereSQL}
            GROUP BY c.id, u.name, sp.next_run_at, sp.schedule_type, sp.status, sp.id
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?
        ");
        $params[] = $limit;
        $params[] = $offset;
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as &$row) {
            $row['media'] = json_decode($row['media'] ?? '[]', true);
        }

        return [
            'data' => $rows,
            'meta' => ['total' => $total, 'page' => $page, 'limit' => $limit, 'pages' => (int) ceil($total / $limit)],
        ];
    }

    public function get(string $workspaceId, string $contentId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT c.*,
                u.name AS created_by_name,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object('id', cm.id, 'media_type', cm.media_type, 'media_url', cm.media_url, 'caption', cm.caption))
                    FILTER (WHERE cm.id IS NOT NULL), '[]'
                ) AS media
            FROM content c
            LEFT JOIN users u ON c.created_by = u.id
            LEFT JOIN content_media cm ON c.id = cm.content_id
            WHERE c.id = ? AND c.workspace_id = ?
            GROUP BY c.id, u.name
        ");
        $stmt->execute([$contentId, $workspaceId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            throw new RuntimeException("Content not found", 404);
        }

        $row['media'] = json_decode($row['media'] ?? '[]', true);
        return $row;
    }

    public function create(string $workspaceId, string $userId, array $data): array
    {
        $title = trim($data['title'] ?? '');
        if (empty($title)) {
            throw new RuntimeException("Title is required", 422);
        }

        $pdo = Connection::get();
        $id = uuid_v4();
        $now = current_timestamp();

        Connection::transaction(function (PDO $pdo) use ($id, $workspaceId, $userId, $data, $title, $now) {
            $stmt = $pdo->prepare("
                INSERT INTO content (id, workspace_id, title, content, destination, status, created_by, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $id, $workspaceId,
                $title,
                $data['content'] ?? '',
                $data['destination'] ?? 'whatsapp',
                $data['status'] ?? 'draft',
                $userId,
                $now, $now,
            ]);

            // Create scheduled post if scheduling data provided
            if (!empty($data['schedule_at']) || !empty($data['schedule'])) {
                $this->scheduleContent($workspaceId, $id, $data, $pdo);
            }
        });

        return $this->get($workspaceId, $id);
    }

    public function update(string $workspaceId, string $contentId, array $data): array
    {
        $pdo     = Connection::get();
        $allowed = ['title', 'content', 'destination', 'status'];
        $sets    = [];
        $params  = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[]   = "{$field} = ?";
                $params[] = $data[$field];
            }
        }

        if (!empty($sets)) {
            $sets[]   = "updated_at = ?";
            $params[] = current_timestamp();
            $params[] = $contentId;
            $params[] = $workspaceId;
            $sql  = "UPDATE content SET " . implode(', ', $sets) . " WHERE id = ? AND workspace_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        return $this->get($workspaceId, $contentId);
    }

    public function delete(string $workspaceId, string $contentId): void
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("DELETE FROM content WHERE id = ? AND workspace_id = ?");
        $stmt->execute([$contentId, $workspaceId]);
    }

    public function getCalendar(string $workspaceId, string $start, string $end): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT sp.*,
                   c.title, c.content AS content_body, c.destination,
                   wc.phone_number, wc.business_name
            FROM scheduled_posts sp
            JOIN content c ON sp.content_id = c.id
            LEFT JOIN whatsapp_connections wc ON sp.connection_id = wc.id
            WHERE sp.workspace_id = ?
              AND sp.next_run_at BETWEEN ? AND ?
            ORDER BY sp.next_run_at ASC
        ");
        $stmt->execute([$workspaceId, $start, $end]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function schedulePost(string $workspaceId, string $contentId, array $data): array
    {
        $pdo = Connection::get();
        return Connection::transaction(function (PDO $pdo) use ($workspaceId, $contentId, $data) {
            // Update content status to scheduled
            $upd = $pdo->prepare("UPDATE content SET status = 'scheduled', updated_at = ? WHERE id = ? AND workspace_id = ?");
            $upd->execute([current_timestamp(), $contentId, $workspaceId]);

            return $this->scheduleContent($workspaceId, $contentId, $data, $pdo);
        });
    }

    private function scheduleContent(string $workspaceId, string $contentId, array $data, PDO $pdo): array
    {
        $spId         = uuid_v4();
        $now          = current_timestamp();
        $scheduleAt   = $data['schedule_at'] ?? $data['next_run_at'] ?? null;
        $scheduleType = $data['schedule_type'] ?? 'once';

        $stmt = $pdo->prepare("
            INSERT INTO scheduled_posts
                (id, workspace_id, content_id, connection_id, recipient_type, target_recipient,
                 schedule_type, timezone, start_date, end_date, recurrence_rule, next_run_at,
                 status, idempotency_key, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', ?, ?, ?)
        ");
        $stmt->execute([
            $spId, $workspaceId, $contentId,
            $data['connection_id'] ?? null,
            $data['recipient_type'] ?? 'broadcast',
            $data['target_recipient'] ?? null,
            $scheduleType,
            $data['timezone'] ?? 'UTC',
            $scheduleAt,
            $data['end_date'] ?? null,
            $data['recurrence_rule'] ?? null,
            $scheduleAt,
            uuid_v4(), // idempotency_key
            $now, $now,
        ]);

        $get = $pdo->prepare("SELECT * FROM scheduled_posts WHERE id = ?");
        $get->execute([$spId]);
        return $get->fetch(PDO::FETCH_ASSOC) ?: [];
    }

    public function cancelScheduled(string $workspaceId, string $scheduledPostId): void
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            UPDATE scheduled_posts SET status = 'cancelled', updated_at = ?
            WHERE id = ? AND workspace_id = ? AND status = 'scheduled'
        ");
        $stmt->execute([current_timestamp(), $scheduledPostId, $workspaceId]);
    }

    public function getTemplates(string $workspaceId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("SELECT * FROM templates WHERE workspace_id = ? ORDER BY name");
        $stmt->execute([$workspaceId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as &$row) {
            $row['variables'] = json_decode($row['variables'] ?? '[]', true);
            $row['buttons']   = json_decode($row['buttons'] ?? '[]', true);
        }

        return $rows;
    }

    public function createTemplate(string $workspaceId, array $data): array
    {
        $name = trim($data['name'] ?? '');
        $body = trim($data['body'] ?? '');
        if (empty($name) || empty($body)) {
            throw new RuntimeException("Template name and body are required", 422);
        }

        $pdo  = Connection::get();
        $id   = uuid_v4();
        $now  = current_timestamp();
        $stmt = $pdo->prepare("
            INSERT INTO templates (id, workspace_id, name, category, language, body, header, footer, buttons, variables, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?)
        ");
        $stmt->execute([
            $id, $workspaceId,
            $name,
            $data['category'] ?? 'marketing',
            $data['language'] ?? 'en',
            $body,
            $data['header'] ?? null,
            $data['footer'] ?? null,
            json_encode($data['buttons'] ?? []),
            json_encode($data['variables'] ?? []),
            $now, $now,
        ]);

        $get = $pdo->prepare("SELECT * FROM templates WHERE id = ?");
        $get->execute([$id]);
        $row = $get->fetch(PDO::FETCH_ASSOC);
        $row['variables'] = json_decode($row['variables'] ?? '[]', true);
        $row['buttons']   = json_decode($row['buttons'] ?? '[]', true);
        return $row;
    }
}
