<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use PDO;
use RuntimeException;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class CrmService
{
    // ==================== LEADS ====================

    public function listLeads(string $workspaceId, array $filters = []): array
    {
        $pdo    = Connection::get();
        $where  = ['l.workspace_id = ?'];
        $params = [$workspaceId];

        if (!empty($filters['stage'])) {
            $where[]  = "l.stage = ?";
            $params[] = $filters['stage'];
        }

        if (!empty($filters['search'])) {
            $where[]  = "(l.title ILIKE ? OR cont.name ILIKE ? OR cont.phone ILIKE ?)";
            $term     = '%' . $filters['search'] . '%';
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        if (!empty($filters['assigned_user_id'])) {
            $where[]  = "l.assigned_user_id = ?";
            $params[] = $filters['assigned_user_id'];
        }

        $whereSQL = implode(' AND ', $where);

        $stmt = $pdo->prepare("
            SELECT l.*,
                   cont.name AS contact_name, cont.phone AS contact_phone, cont.email AS contact_email,
                   u.name AS assigned_user_name
            FROM leads l
            JOIN contacts cont ON l.contact_id = cont.id
            LEFT JOIN users u ON l.assigned_user_id = u.id
            WHERE {$whereSQL}
            ORDER BY l.created_at DESC
        ");
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getLead(string $workspaceId, string $leadId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT l.*,
                   cont.name AS contact_name, cont.phone AS contact_phone, cont.email AS contact_email,
                   u.name AS assigned_user_name
            FROM leads l
            JOIN contacts cont ON l.contact_id = cont.id
            LEFT JOIN users u ON l.assigned_user_id = u.id
            WHERE l.id = ? AND l.workspace_id = ?
        ");
        $stmt->execute([$leadId, $workspaceId]);
        $lead = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$lead) {
            throw new RuntimeException("Lead not found", 404);
        }

        // Fetch activities
        $actStmt = $pdo->prepare("
            SELECT a.*, u.name AS user_name
            FROM activities a
            LEFT JOIN users u ON a.user_id = u.id
            WHERE a.lead_id = ? AND a.workspace_id = ?
            ORDER BY a.created_at DESC
            LIMIT 20
        ");
        $actStmt->execute([$leadId, $workspaceId]);
        $lead['activities'] = $actStmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch notes
        $noteStmt = $pdo->prepare("
            SELECT n.*, u.name AS user_name
            FROM notes n
            LEFT JOIN users u ON n.user_id = u.id
            WHERE n.lead_id = ? AND n.workspace_id = ?
            ORDER BY n.created_at DESC
        ");
        $noteStmt->execute([$leadId, $workspaceId]);
        $lead['notes'] = $noteStmt->fetchAll(PDO::FETCH_ASSOC);

        return $lead;
    }

    public function createLead(string $workspaceId, string $userId, array $data): array
    {
        $title = trim($data['title'] ?? '');
        if (empty($title)) {
            throw new RuntimeException("Lead title is required", 422);
        }
        if (empty($data['contact_id'])) {
            throw new RuntimeException("Contact ID is required", 422);
        }

        $pdo = Connection::get();
        $id  = uuid_v4();
        $now = current_timestamp();

        $stmt = $pdo->prepare("
            INSERT INTO leads (id, workspace_id, contact_id, title, value, currency, stage,
                assigned_user_id, source, probability, expected_close_date, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id, $workspaceId,
            $data['contact_id'],
            $title,
            $data['value'] ?? 0,
            $data['currency'] ?? 'USD',
            $data['stage'] ?? 'new',
            $data['assigned_user_id'] ?? $userId,
            $data['source'] ?? 'manual',
            $data['probability'] ?? 20,
            $data['expected_close_date'] ?? null,
            $now, $now,
        ]);

        $this->logActivity($workspaceId, $userId, null, $id, 'status_change', 'Lead created in stage: ' . ($data['stage'] ?? 'new'));

        return $this->getLead($workspaceId, $id);
    }

    public function updateLead(string $workspaceId, string $leadId, array $data, string $userId): array
    {
        $pdo     = Connection::get();
        $allowed = ['title', 'value', 'currency', 'stage', 'assigned_user_id', 'source', 'probability', 'expected_close_date'];
        $sets    = [];
        $params  = [];

        // Track stage change
        $oldStageStmt = $pdo->prepare("SELECT stage FROM leads WHERE id = ? AND workspace_id = ?");
        $oldStageStmt->execute([$leadId, $workspaceId]);
        $oldStage = $oldStageStmt->fetchColumn();

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[]   = "{$field} = ?";
                $params[] = $data[$field];
            }
        }

        if (!empty($sets)) {
            $sets[]   = "updated_at = ?";
            $params[] = current_timestamp();
            $params[] = $leadId;
            $params[] = $workspaceId;
            $sql  = "UPDATE leads SET " . implode(', ', $sets) . " WHERE id = ? AND workspace_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        if (!empty($data['stage']) && $data['stage'] !== $oldStage) {
            $this->logActivity($workspaceId, $userId, null, $leadId, 'status_change',
                "Stage moved from {$oldStage} to {$data['stage']}");
        }

        return $this->getLead($workspaceId, $leadId);
    }

    public function deleteLead(string $workspaceId, string $leadId): void
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("DELETE FROM leads WHERE id = ? AND workspace_id = ?");
        $stmt->execute([$leadId, $workspaceId]);
    }

    public function addNote(string $workspaceId, string $leadId, string $content, string $userId): array
    {
        $pdo = Connection::get();
        $id  = uuid_v4();
        $now = current_timestamp();

        $stmt = $pdo->prepare("
            INSERT INTO notes (id, workspace_id, lead_id, user_id, content, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$id, $workspaceId, $leadId, $userId, $content, $now, $now]);
        $this->logActivity($workspaceId, $userId, null, $leadId, 'note', 'Note added');

        $get = $pdo->prepare("SELECT n.*, u.name AS user_name FROM notes n LEFT JOIN users u ON n.user_id = u.id WHERE n.id = ?");
        $get->execute([$id]);
        return $get->fetch(PDO::FETCH_ASSOC);
    }

    // ==================== PIPELINE ====================

    public function getPipelineBoard(string $workspaceId): array
    {
        $stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
        $result = [];

        foreach ($stages as $stage) {
            $leads = $this->listLeads($workspaceId, ['stage' => $stage]);
            $result[] = [
                'stage'  => $stage,
                'leads'  => $leads,
                'count'  => count($leads),
                'value'  => array_sum(array_column($leads, 'value')),
            ];
        }

        return $result;
    }

    // ==================== ACTIVITIES ====================

    private function logActivity(string $workspaceId, string $userId, ?string $contactId, ?string $leadId, string $type, string $description): void
    {
        try {
            $pdo  = Connection::get();
            $id   = uuid_v4();
            $now  = current_timestamp();
            $stmt = $pdo->prepare("
                INSERT INTO activities (id, workspace_id, contact_id, lead_id, user_id, type, description, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$id, $workspaceId, $contactId, $leadId, $userId, $type, $description, $now]);
        } catch (\Throwable) {
            // Non-critical — don't fail the main operation
        }
    }
}
