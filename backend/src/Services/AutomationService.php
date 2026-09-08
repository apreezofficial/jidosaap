<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use App\Security\EncryptionService;
use PDO;
use RuntimeException;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class AutomationService
{
    public function list(string $workspaceId, array $filters = []): array
    {
        $pdo    = Connection::get();
        $where  = ['a.workspace_id = ?'];
        $params = [$workspaceId];

        if (!empty($filters['status'])) {
            $where[]  = "a.status = ?";
            $params[] = $filters['status'];
        }

        if (!empty($filters['search'])) {
            $where[]  = "a.name ILIKE ?";
            $params[] = '%' . $filters['search'] . '%';
        }

        $page   = max(1, (int)($filters['page'] ?? 1));
        $limit  = min(100, max(1, (int)($filters['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;
        $whereSQL = implode(' AND ', $where);

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM automations a WHERE {$whereSQL}");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $stmt = $pdo->prepare("
            SELECT a.*,
                COUNT(DISTINCT ar.id) AS total_runs,
                COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'completed') AS successful_runs,
                COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'failed') AS failed_runs,
                u.name AS created_by_name
            FROM automations a
            LEFT JOIN automation_runs ar ON a.id = ar.automation_id
            LEFT JOIN users u ON a.created_by = u.id
            WHERE {$whereSQL}
            GROUP BY a.id, u.name
            ORDER BY a.created_at DESC
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

    public function get(string $workspaceId, string $automationId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("SELECT * FROM automations WHERE id = ? AND workspace_id = ?");
        $stmt->execute([$automationId, $workspaceId]);
        $automation = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$automation) {
            throw new RuntimeException("Automation not found", 404);
        }

        // Fetch nodes and edges
        $nodeStmt = $pdo->prepare("
            SELECT id, automation_id,
                COALESCE(node_id, node_key, id) AS node_id,
                type,
                COALESCE(label, type) AS label,
                COALESCE(config, '{}') AS config,
                COALESCE(position, json_build_object('x', COALESCE(position_x,0), 'y', COALESCE(position_y,0))) AS position,
                created_at
            FROM automation_nodes WHERE automation_id = ? ORDER BY created_at
        ");
        $nodeStmt->execute([$automationId]);
        $nodes = $nodeStmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($nodes as &$node) {
            $node['config']   = is_string($node['config'])   ? json_decode($node['config'], true)   : ($node['config'] ?? []);
            $node['position'] = is_string($node['position']) ? json_decode($node['position'], true) : ($node['position'] ?? ['x' => 0, 'y' => 0]);
        }
        unset($node);

        $edgeStmt = $pdo->prepare("
            SELECT id, automation_id,
                COALESCE(edge_id, edge_key, id) AS edge_id,
                COALESCE(source_node_id, source_node_key) AS source_node_id,
                COALESCE(target_node_id, target_node_key) AS target_node_id,
                label
            FROM automation_edges WHERE automation_id = ?
        ");
        $edgeStmt->execute([$automationId]);
        $edges = $edgeStmt->fetchAll(PDO::FETCH_ASSOC);

        $automation['nodes'] = $nodes;
        $automation['edges'] = $edges;
        return $automation;
    }

    public function create(string $workspaceId, string $userId, array $data): array
    {
        $name = trim($data['name'] ?? '');
        if (empty($name)) {
            throw new RuntimeException("Automation name is required", 422);
        }

        $pdo = Connection::get();
        $id  = uuid_v4();
        $now = current_timestamp();

        Connection::transaction(function (PDO $pdo) use ($id, $workspaceId, $userId, $data, $name, $now) {
            $stmt = $pdo->prepare("
                INSERT INTO automations (id, workspace_id, name, description, trigger_type, trigger_config,
                    status, created_by, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, 'inactive', ?, ?, ?)
                ON CONFLICT DO NOTHING
            ");
            $stmt->execute([
                $id, $workspaceId,
                $name,
                $data['description'] ?? '',
                $data['trigger_type'] ?? 'manual',
                json_encode($data['trigger_config'] ?? []),
                $userId,
                $now, $now,
            ]);

            // Save nodes
            if (!empty($data['nodes']) && is_array($data['nodes'])) {
                $this->saveNodes($id, $data['nodes'], $pdo);
            }

            // Save edges
            if (!empty($data['edges']) && is_array($data['edges'])) {
                $this->saveEdges($id, $data['edges'], $pdo);
            }

            AuditLogService::log($workspaceId, $userId, 'automation_created', 'automations', $id, ['name' => $name]);
        });

        return $this->get($workspaceId, $id);
    }

    public function update(string $workspaceId, string $automationId, array $data): array
    {
        $pdo     = Connection::get();
        $allowed = ['name', 'description', 'trigger_type', 'trigger_config'];
        $sets    = [];
        $params  = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[]   = "{$field} = ?";
                $params[] = ($field === 'trigger_config') ? json_encode($data[$field]) : $data[$field];
            }
        }

        if (!empty($sets)) {
            $sets[]   = "updated_at = ?";
            $params[] = current_timestamp();
            $params[] = $automationId;
            $params[] = $workspaceId;
            $sql  = "UPDATE automations SET " . implode(', ', $sets) . " WHERE id = ? AND workspace_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        // Replace nodes and edges if provided
        if (isset($data['nodes'])) {
            $pdo->prepare("DELETE FROM automation_nodes WHERE automation_id = ?")->execute([$automationId]);
            $this->saveNodes($automationId, $data['nodes'], $pdo);
        }

        if (isset($data['edges'])) {
            $pdo->prepare("DELETE FROM automation_edges WHERE automation_id = ?")->execute([$automationId]);
            $this->saveEdges($automationId, $data['edges'], $pdo);
        }

        return $this->get($workspaceId, $automationId);
    }

    public function setStatus(string $workspaceId, string $automationId, string $status, string $userId): array
    {
        $valid = ['active', 'inactive'];
        if (!in_array($status, $valid, true)) {
            throw new RuntimeException("Invalid status", 422);
        }

        $pdo  = Connection::get();
        $stmt = $pdo->prepare("UPDATE automations SET status = ?, updated_at = ? WHERE id = ? AND workspace_id = ?");
        $stmt->execute([$status, current_timestamp(), $automationId, $workspaceId]);

        $action = $status === 'active' ? 'automation_enabled' : 'automation_disabled';
        AuditLogService::log($workspaceId, $userId, $action, 'automations', $automationId);

        return $this->get($workspaceId, $automationId);
    }

    public function delete(string $workspaceId, string $automationId): void
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("DELETE FROM automations WHERE id = ? AND workspace_id = ?");
        $stmt->execute([$automationId, $workspaceId]);
    }

    public function getRuns(string $workspaceId, string $automationId, int $page = 1, int $limit = 20): array
    {
        $pdo    = Connection::get();
        $offset = ($page - 1) * $limit;

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM automation_runs WHERE automation_id = ? AND workspace_id = ?");
        $countStmt->execute([$automationId, $workspaceId]);
        $total = (int) $countStmt->fetchColumn();

        $stmt = $pdo->prepare("
            SELECT * FROM automation_runs
            WHERE automation_id = ? AND workspace_id = ?
            ORDER BY started_at DESC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$automationId, $workspaceId, $limit, $offset]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as &$row) {
            $row['input']  = json_decode($row['input'] ?? '{}', true);
            $row['output'] = json_decode($row['output'] ?? '{}', true);
        }

        return [
            'data' => $rows,
            'meta' => ['total' => $total, 'page' => $page, 'limit' => $limit],
        ];
    }

    public function getApiConnections(string $workspaceId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT id, workspace_id, name, base_url, auth_type, headers, status, last_tested_at, created_at, updated_at
            FROM api_connections
            WHERE workspace_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$workspaceId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as &$row) {
            $row['headers'] = json_decode($row['headers'] ?? '{}', true);
            // Never expose credentials
        }

        return $rows;
    }

    public function createApiConnection(string $workspaceId, string $userId, array $data): array
    {
        $name = trim($data['name'] ?? '');
        $url  = trim($data['base_url'] ?? '');
        if (empty($name) || empty($url)) {
            throw new RuntimeException("Name and base URL are required", 422);
        }

        $pdo  = Connection::get();
        $id   = uuid_v4();
        $now  = current_timestamp();

        // Encrypt credentials before storage
        $credentials = '';
        if (!empty($data['credentials'])) {
            $credentials = EncryptionService::encrypt(json_encode($data['credentials']));
        }

        $stmt = $pdo->prepare("
            INSERT INTO api_connections (id, workspace_id, name, base_url, auth_type, headers,
                credentials_encrypted, status, created_by, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
        ");
        $stmt->execute([
            $id, $workspaceId, $name, $url,
            $data['auth_type'] ?? 'none',
            json_encode($data['headers'] ?? []),
            $credentials ?: null,
            $userId,
            $now, $now,
        ]);

        AuditLogService::log($workspaceId, $userId, 'api_connection_created', 'api_connections', $id, ['name' => $name]);

        $get = $pdo->prepare("SELECT id, workspace_id, name, base_url, auth_type, headers, status, created_at FROM api_connections WHERE id = ?");
        $get->execute([$id]);
        return $get->fetch(PDO::FETCH_ASSOC);
    }

    public function testApiConnection(string $workspaceId, string $connectionId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("SELECT * FROM api_connections WHERE id = ? AND workspace_id = ?");
        $stmt->execute([$connectionId, $workspaceId]);
        $conn = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$conn) {
            throw new RuntimeException("API connection not found", 404);
        }

        $start = microtime(true);
        try {
            $ch = curl_init($conn['base_url']);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 10,
                CURLOPT_HEADER         => false,
                CURLOPT_NOBODY         => true,
            ]);
            curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error    = curl_error($ch);
            curl_close($ch);

            $duration = round((microtime(true) - $start) * 1000);
            $success  = $httpCode > 0 && $httpCode < 500;

            // Update last_tested_at
            $upd = $pdo->prepare("UPDATE api_connections SET last_tested_at = ?, updated_at = ? WHERE id = ?");
            $upd->execute([current_timestamp(), current_timestamp(), $connectionId]);

            return [
                'success'   => $success,
                'http_code' => $httpCode,
                'duration'  => $duration,
                'error'     => $error ?: null,
            ];
        } catch (\Throwable $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    private function saveNodes(string $automationId, array $nodes, PDO $pdo): void
    {
        $stmt = $pdo->prepare("
            INSERT INTO automation_nodes
                (id, automation_id, node_key, node_id, type, label, config, position, position_x, position_y, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (automation_id, node_id) DO UPDATE
            SET type = EXCLUDED.type, label = EXCLUDED.label,
                config = EXCLUDED.config, position = EXCLUDED.position,
                position_x = EXCLUDED.position_x, position_y = EXCLUDED.position_y
        ");

        foreach ($nodes as $node) {
            $nodeId  = $node['id'];
            $type    = $node['type'];
            $label   = $node['label'] ?? $node['data']['label'] ?? $type;
            $config  = json_encode($node['data'] ?? $node['config'] ?? []);
            $posX    = (float) ($node['position']['x'] ?? 0);
            $posY    = (float) ($node['position']['y'] ?? 0);
            $posJson = json_encode(['x' => $posX, 'y' => $posY]);
            $stmt->execute([
                uuid_v4(), $automationId, $nodeId, $nodeId,
                $type, $label, $config, $posJson, $posX, $posY,
                current_timestamp(),
            ]);
        }
    }

    private function saveEdges(string $automationId, array $edges, PDO $pdo): void
    {
        $stmt = $pdo->prepare("
            INSERT INTO automation_edges
                (id, automation_id, edge_key, edge_id, source_node_key, source_node_id, target_node_key, target_node_id, label, condition, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (automation_id, edge_id) DO UPDATE
            SET source_node_id = EXCLUDED.source_node_id,
                target_node_id = EXCLUDED.target_node_id,
                label = EXCLUDED.label
        ");

        foreach ($edges as $edge) {
            $edgeId = $edge['id'];
            $src    = $edge['source'];
            $tgt    = $edge['target'];
            $label  = $edge['label'] ?? null;
            $cond   = json_encode($edge['data'] ?? []);
            $stmt->execute([
                uuid_v4(), $automationId,
                $edgeId, $edgeId,
                $src, $src, $tgt, $tgt,
                $label, $cond,
                current_timestamp(),
            ]);
        }
    }
}
