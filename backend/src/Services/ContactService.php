<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use PDO;
use RuntimeException;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class ContactService
{
    public function list(string $workspaceId, array $filters = []): array
    {
        $pdo = Connection::get();
        $where = ['c.workspace_id = ?'];
        $params = [$workspaceId];

        if (!empty($filters['search'])) {
            $where[] = "(c.name ILIKE ? OR c.phone ILIKE ? OR c.email ILIKE ?)";
            $term = '%' . $filters['search'] . '%';
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        if (!empty($filters['status'])) {
            $where[] = "c.status = ?";
            $params[] = $filters['status'];
        }

        if (!empty($filters['source'])) {
            $where[] = "c.source = ?";
            $params[] = $filters['source'];
        }

        $page   = max(1, (int)($filters['page'] ?? 1));
        $limit  = min(100, max(1, (int)($filters['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;

        $whereSQL = implode(' AND ', $where);

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM contacts c WHERE {$whereSQL}");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $stmt = $pdo->prepare("
            SELECT c.*,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'color', t.color))
                    FILTER (WHERE t.id IS NOT NULL), '[]'
                ) AS tags
            FROM contacts c
            LEFT JOIN contact_tags ct ON c.id = ct.contact_id
            LEFT JOIN tags t ON ct.tag_id = t.id
            WHERE {$whereSQL}
            GROUP BY c.id
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?
        ");
        $params[] = $limit;
        $params[] = $offset;
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as &$row) {
            $row['tags'] = json_decode($row['tags'] ?? '[]', true);
        }

        return [
            'data'  => $rows,
            'meta'  => ['total' => $total, 'page' => $page, 'limit' => $limit, 'pages' => (int) ceil($total / $limit)],
        ];
    }

    public function get(string $workspaceId, string $contactId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT c.*,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'color', t.color))
                    FILTER (WHERE t.id IS NOT NULL), '[]'
                ) AS tags
            FROM contacts c
            LEFT JOIN contact_tags ct ON c.id = ct.contact_id
            LEFT JOIN tags t ON ct.tag_id = t.id
            WHERE c.id = ? AND c.workspace_id = ?
            GROUP BY c.id
        ");
        $stmt->execute([$contactId, $workspaceId]);
        $contact = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$contact) {
            throw new RuntimeException("Contact not found", 404);
        }

        $contact['tags'] = json_decode($contact['tags'] ?? '[]', true);
        return $contact;
    }

    public function create(string $workspaceId, array $data): array
    {
        $name  = trim($data['name'] ?? '');
        $phone = trim($data['phone'] ?? '');

        if (empty($name) || empty($phone)) {
            throw new RuntimeException("Name and phone are required", 422);
        }

        $pdo = Connection::get();

        // Check for duplicate phone in workspace
        $dup = $pdo->prepare("SELECT id FROM contacts WHERE workspace_id = ? AND phone = ?");
        $dup->execute([$workspaceId, $phone]);
        if ($dup->fetch()) {
            throw new RuntimeException("A contact with this phone number already exists", 409);
        }

        $id  = uuid_v4();
        $now = current_timestamp();
        $stmt = $pdo->prepare("
            INSERT INTO contacts (id, workspace_id, name, phone, email, company, source, status, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id, $workspaceId,
            $name, $phone,
            $data['email'] ?? null,
            $data['company'] ?? null,
            $data['source'] ?? 'manual',
            $data['status'] ?? 'active',
            $data['notes'] ?? null,
            $now, $now,
        ]);

        if (!empty($data['tags']) && is_array($data['tags'])) {
            $this->syncTags($workspaceId, $id, $data['tags'], $pdo);
        }

        AuditLogService::log($workspaceId, null, 'contact_created', 'contacts', $id, ['name' => $name]);
        return $this->get($workspaceId, $id);
    }

    public function update(string $workspaceId, string $contactId, array $data): array
    {
        $pdo     = Connection::get();
        $allowed = ['name', 'phone', 'email', 'company', 'source', 'status', 'notes', 'avatar_url'];
        $sets    = [];
        $params  = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[]   = "{$field} = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($sets)) {
            return $this->get($workspaceId, $contactId);
        }

        $sets[]   = "updated_at = ?";
        $params[] = current_timestamp();
        $params[] = $contactId;
        $params[] = $workspaceId;

        $sql  = "UPDATE contacts SET " . implode(', ', $sets) . " WHERE id = ? AND workspace_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        if (isset($data['tags']) && is_array($data['tags'])) {
            $this->syncTags($workspaceId, $contactId, $data['tags'], $pdo);
        }

        return $this->get($workspaceId, $contactId);
    }

    public function delete(string $workspaceId, string $contactId): void
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("DELETE FROM contacts WHERE id = ? AND workspace_id = ?");
        $stmt->execute([$contactId, $workspaceId]);
        AuditLogService::log($workspaceId, null, 'contact_deleted', 'contacts', $contactId);
    }

    public function getTags(string $workspaceId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("SELECT * FROM tags WHERE workspace_id = ? ORDER BY name");
        $stmt->execute([$workspaceId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createTag(string $workspaceId, string $name, string $color = '#E11D48'): array
    {
        $pdo  = Connection::get();
        $name = trim($name);
        if (empty($name)) {
            throw new RuntimeException("Tag name required", 422);
        }

        $id  = uuid_v4();
        $now = current_timestamp();
        $stmt = $pdo->prepare("INSERT INTO tags (id, workspace_id, name, color, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT (workspace_id, name) DO NOTHING");
        $stmt->execute([$id, $workspaceId, $name, $color, $now]);

        $get = $pdo->prepare("SELECT * FROM tags WHERE workspace_id = ? AND name = ?");
        $get->execute([$workspaceId, $name]);
        return $get->fetch(PDO::FETCH_ASSOC);
    }

    private function syncTags(string $workspaceId, string $contactId, array $tagIds, PDO $pdo): void
    {
        $del = $pdo->prepare("DELETE FROM contact_tags WHERE contact_id = ?");
        $del->execute([$contactId]);

        foreach ($tagIds as $tagId) {
            // Verify tag belongs to workspace
            $check = $pdo->prepare("SELECT id FROM tags WHERE id = ? AND workspace_id = ?");
            $check->execute([$tagId, $workspaceId]);
            if ($check->fetch()) {
                $ins = $pdo->prepare("INSERT INTO contact_tags (contact_id, tag_id) VALUES (?, ?) ON CONFLICT DO NOTHING");
                $ins->execute([$contactId, $tagId]);
            }
        }
    }

    public function importCsv(string $workspaceId, string $csvContent): array
    {
        $lines   = array_filter(array_map('trim', explode("\n", $csvContent)));
        $header  = null;
        $created = 0;
        $skipped = 0;

        foreach ($lines as $line) {
            $cols = str_getcsv($line);
            if ($header === null) {
                $header = array_map('strtolower', $cols);
                continue;
            }

            $row = array_combine($header, $cols) ?: [];
            $phone = trim($row['phone'] ?? '');
            $name  = trim($row['name'] ?? '');

            if (empty($phone) || empty($name)) {
                $skipped++;
                continue;
            }

            try {
                $this->create($workspaceId, [
                    'name'    => $name,
                    'phone'   => $phone,
                    'email'   => $row['email'] ?? null,
                    'company' => $row['company'] ?? null,
                    'source'  => 'import',
                ]);
                $created++;
            } catch (\Throwable) {
                $skipped++;
            }
        }

        return ['created' => $created, 'skipped' => $skipped];
    }
}
