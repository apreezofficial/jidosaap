<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use PDO;
use RuntimeException;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class AgentService
{
    public function list(string $workspaceId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT a.id, a.workspace_id, a.name, a.description, a.personality, a.tone, a.language,
                a.business_info, a.instructions,
                COALESCE(a.status, CASE WHEN a.is_active = 1 THEN 'active' ELSE 'inactive' END) AS status,
                a.working_hours, a.escalation_rules, a.created_at, a.updated_at,
                COUNT(DISTINCT at2.id) FILTER (WHERE at2.enabled = 1 OR at2.is_enabled = 1) AS tool_count,
                COUNT(DISTINCT kb.id) AS knowledge_base_count
            FROM ai_agents a
            LEFT JOIN ai_agent_tools at2 ON a.id = at2.agent_id
            LEFT JOIN knowledge_bases kb ON kb.agent_id = a.id
            WHERE a.workspace_id = ?
            GROUP BY a.id
            ORDER BY a.created_at DESC
        ");
        $stmt->execute([$workspaceId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as &$row) {
            $row['working_hours']    = $row['working_hours']    ? json_decode($row['working_hours'], true)    : null;
            $row['escalation_rules'] = $row['escalation_rules'] ? json_decode($row['escalation_rules'], true) : [];
        }
        unset($row);

        return $rows;
    }

    public function get(string $workspaceId, string $agentId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT id, workspace_id, name, description, personality, tone, language,
                business_info, instructions,
                COALESCE(status, CASE WHEN is_active = 1 THEN 'active' ELSE 'inactive' END) AS status,
                working_hours, escalation_rules, created_at, updated_at
            FROM ai_agents WHERE id = ? AND workspace_id = ?
        ");
        $stmt->execute([$agentId, $workspaceId]);
        $agent = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$agent) {
            throw new RuntimeException("AI agent not found", 404);
        }

        $agent['working_hours']    = $agent['working_hours']    ? json_decode($agent['working_hours'], true)    : null;
        $agent['escalation_rules'] = $agent['escalation_rules'] ? json_decode($agent['escalation_rules'], true) : [];

        // Fetch tools
        $toolStmt = $pdo->prepare("
            SELECT id, tool_name,
                COALESCE(enabled, is_enabled, 1) AS enabled,
                COALESCE(config, '{}') AS config
            FROM ai_agent_tools WHERE agent_id = ?
        ");
        $toolStmt->execute([$agentId]);
        $agent['tools'] = $toolStmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch knowledge bases
        $kbStmt = $pdo->prepare("
            SELECT kb.*, COUNT(d.id) AS document_count
            FROM knowledge_bases kb
            LEFT JOIN documents d ON d.knowledge_base_id = kb.id
            WHERE kb.agent_id = ?
            GROUP BY kb.id
        ");
        $kbStmt->execute([$agentId]);
        $agent['knowledge_bases'] = $kbStmt->fetchAll(PDO::FETCH_ASSOC);

        return $agent;
    }

    public function create(string $workspaceId, string $userId, array $data): array
    {
        $name = trim($data['name'] ?? '');
        if (empty($name)) {
            throw new RuntimeException("Agent name is required", 422);
        }

        $pdo = Connection::get();
        $id  = uuid_v4();
        $now = current_timestamp();

        Connection::transaction(function (PDO $pdo) use ($id, $workspaceId, $userId, $data, $name, $now) {
            $stmt = $pdo->prepare("
                INSERT INTO ai_agents
                    (id, workspace_id, name, description, personality, tone, language,
                     business_info, instructions, is_active, status, working_hours, escalation_rules,
                     created_by, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'active', ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $id, $workspaceId,
                $name,
                $data['description'] ?? '',
                $data['personality'] ?? 'professional',
                $data['tone'] ?? 'professional',
                $data['language'] ?? 'en',
                $data['business_info'] ?? null,
                $data['instructions'] ?? null,
                json_encode($data['working_hours'] ?? null),
                json_encode($data['escalation_rules'] ?? []),
                $userId,
                $now, $now,
            ]);

            // Create default enabled tools
            $defaultTools = ['searchKnowledgeBase', 'createLead', 'addContactTag', 'requestHumanHandoff'];
            if (!empty($data['tools']) && is_array($data['tools'])) {
                $enabledTools = $data['tools'];
            } else {
                $enabledTools = $defaultTools;
            }

            foreach ($enabledTools as $toolName) {
                $toolId = uuid_v4();
                $toolStmt = $pdo->prepare("
                    INSERT INTO ai_agent_tools (id, agent_id, tool_name, is_enabled, enabled, config, created_at)
                    VALUES (?, ?, ?, 1, 1, '{}', ?)
                ");
                $toolStmt->execute([$toolId, $id, $toolName, $now]);
            }

            AuditLogService::log($workspaceId, $userId, 'ai_agent_created', 'ai_agents', $id, ['name' => $name]);
        });

        return $this->get($workspaceId, $id);
    }

    public function update(string $workspaceId, string $agentId, array $data, string $userId): array
    {
        $pdo     = Connection::get();
        $allowed = ['name', 'description', 'personality', 'tone', 'language', 'business_info', 'instructions', 'status'];
        $sets    = [];
        $params  = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[]   = "{$field} = ?";
                $params[] = $data[$field];
            }
        }

        if (array_key_exists('working_hours', $data)) {
            $sets[]   = "working_hours = ?";
            $params[] = json_encode($data['working_hours']);
        }

        if (array_key_exists('escalation_rules', $data)) {
            $sets[]   = "escalation_rules = ?";
            $params[] = json_encode($data['escalation_rules']);
        }

        if (!empty($sets)) {
            $sets[]   = "updated_at = ?";
            $params[] = current_timestamp();
            $params[] = $agentId;
            $params[] = $workspaceId;
            $sql  = "UPDATE ai_agents SET " . implode(', ', $sets) . " WHERE id = ? AND workspace_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        // Update tools if provided
        if (isset($data['tools']) && is_array($data['tools'])) {
            $del = $pdo->prepare("DELETE FROM ai_agent_tools WHERE agent_id = ?");
            $del->execute([$agentId]);
            $now = current_timestamp();
            foreach ($data['tools'] as $toolName) {
                $toolId = uuid_v4();
                $ts = $pdo->prepare("INSERT INTO ai_agent_tools (id, agent_id, tool_name, enabled, config, created_at) VALUES (?, ?, ?, 1, '{}', ?)");
                $ts->execute([$toolId, $agentId, $toolName, $now]);
            }
        }

        AuditLogService::log($workspaceId, $userId, 'ai_agent_modified', 'ai_agents', $agentId);
        return $this->get($workspaceId, $agentId);
    }

    public function delete(string $workspaceId, string $agentId): void
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("DELETE FROM ai_agents WHERE id = ? AND workspace_id = ?");
        $stmt->execute([$agentId, $workspaceId]);
    }

    // Knowledge Base management
    public function getKnowledgeBases(string $workspaceId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT kb.*,
                COUNT(d.id) AS document_count,
                a.name AS agent_name
            FROM knowledge_bases kb
            LEFT JOIN documents d ON d.knowledge_base_id = kb.id
            LEFT JOIN ai_agents a ON kb.agent_id = a.id
            WHERE kb.workspace_id = ?
            GROUP BY kb.id, a.name
            ORDER BY kb.created_at DESC
        ");
        $stmt->execute([$workspaceId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createKnowledgeBase(string $workspaceId, string $userId, array $data): array
    {
        $name = trim($data['name'] ?? '');
        if (empty($name)) {
            throw new RuntimeException("Knowledge base name is required", 422);
        }

        $pdo  = Connection::get();
        $id   = uuid_v4();
        $now  = current_timestamp();
        $stmt = $pdo->prepare("
            INSERT INTO knowledge_bases (id, workspace_id, agent_id, name, description, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
        ");
        $stmt->execute([
            $id, $workspaceId,
            $data['agent_id'] ?? null,
            $name,
            $data['description'] ?? '',
            $now, $now,
        ]);

        $get = $pdo->prepare("SELECT * FROM knowledge_bases WHERE id = ?");
        $get->execute([$id]);
        return $get->fetch(PDO::FETCH_ASSOC);
    }

    public function getDocuments(string $workspaceId, string $kbId): array
    {
        $pdo  = Connection::get();

        // Verify KB belongs to workspace
        $check = $pdo->prepare("SELECT id FROM knowledge_bases WHERE id = ? AND workspace_id = ?");
        $check->execute([$kbId, $workspaceId]);
        if (!$check->fetch()) {
            throw new RuntimeException("Knowledge base not found", 404);
        }

        $stmt = $pdo->prepare("
            SELECT id, knowledge_base_id, file_name, file_type, file_size, status,
                chunk_count, created_at, updated_at
            FROM documents
            WHERE knowledge_base_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$kbId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addDocument(string $workspaceId, string $kbId, array $data): array
    {
        $pdo  = Connection::get();

        $check = $pdo->prepare("SELECT id FROM knowledge_bases WHERE id = ? AND workspace_id = ?");
        $check->execute([$kbId, $workspaceId]);
        if (!$check->fetch()) {
            throw new RuntimeException("Knowledge base not found", 404);
        }

        $id   = uuid_v4();
        $now  = current_timestamp();
        $stmt = $pdo->prepare("
            INSERT INTO documents (id, knowledge_base_id, workspace_id, file_name, file_type, file_size,
                file_url, status, chunk_count, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'processing', 0, ?, ?)
        ");
        $stmt->execute([
            $id, $kbId, $workspaceId,
            $data['file_name'],
            $data['file_type'] ?? 'text/plain',
            $data['file_size'] ?? 0,
            $data['file_url'] ?? '',
            $now, $now,
        ]);

        // Queue processing job
        $this->queueDocumentProcessing($id, $workspaceId, $kbId, $data);

        $get = $pdo->prepare("SELECT * FROM documents WHERE id = ?");
        $get->execute([$id]);
        return $get->fetch(PDO::FETCH_ASSOC);
    }

    private function queueDocumentProcessing(string $docId, string $workspaceId, string $kbId, array $data): void
    {
        try {
            $payload = json_encode([
                'job'          => 'ProcessDocument',
                'document_id'  => $docId,
                'workspace_id' => $workspaceId,
                'kb_id'        => $kbId,
                'file_url'     => $data['file_url'] ?? '',
                'file_type'    => $data['file_type'] ?? 'text/plain',
                'queued_at'    => time(),
            ]);

            $redis = new \Redis();
            $redis->connect(
                getenv('REDIS_HOST') ?: '127.0.0.1',
                (int)(getenv('REDIS_PORT') ?: 6379)
            );
            $redis->rPush('jidosapp:queue:default', $payload);
        } catch (\Throwable) {
            // Redis unavailable — job will be picked up by polling worker
        }
    }
}
