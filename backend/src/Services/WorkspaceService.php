<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use PDO;
use RuntimeException;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class WorkspaceService
{
    public function create(string $userId, string $name, string $timezone = 'UTC', string $businessType = 'services'): array
    {
        $name = trim($name);
        if (empty($name)) {
            throw new RuntimeException("Workspace name is required", 422);
        }

        $pdo = Connection::get();
        $now = current_timestamp();
        $wsId = uuid_v4();
        $baseSlug = preg_replace('/[^a-z0-9]+/', '-', strtolower($name)) ?: 'workspace';
        $slug = $baseSlug . '-' . substr(str_replace('-', '', $wsId), 0, 6);

        return Connection::transaction(function (PDO $pdo) use ($wsId, $name, $slug, $timezone, $businessType, $userId, $now) {
            $stmt = $pdo->prepare("
                INSERT INTO workspaces (id, name, slug, timezone, currency, business_type, created_by, created_at, updated_at)
                VALUES (?, ?, ?, ?, 'USD', ?, ?, ?, ?)
            ");
            $stmt->execute([$wsId, $name, $slug, $timezone, $businessType, $userId, $now, $now]);

            $memberId = uuid_v4();
            $stmtM = $pdo->prepare("
                INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at, updated_at)
                VALUES (?, ?, ?, 'owner', ?, ?)
            ");
            $stmtM->execute([$memberId, $wsId, $userId, $now, $now]);

            AuditLogService::log($wsId, $userId, 'workspace_created', 'workspaces', $wsId, ['name' => $name]);

            return [
                'id'            => $wsId,
                'name'          => $name,
                'slug'          => $slug,
                'timezone'      => $timezone,
                'business_type' => $businessType,
                'role'          => 'owner',
            ];
        });
    }

    public function listForUser(string $userId): array
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare("
            SELECT w.*, wm.role, wm.created_at as joined_at
            FROM workspaces w
            JOIN workspace_members wm ON w.id = wm.workspace_id
            WHERE wm.user_id = ?
            ORDER BY wm.created_at ASC
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function get(string $workspaceId): array
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare("SELECT * FROM workspaces WHERE id = ?");
        $stmt->execute([$workspaceId]);
        $ws = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$ws) {
            throw new RuntimeException("Workspace not found", 404);
        }

        return $ws;
    }

    public function update(string $workspaceId, array $data): array
    {
        $pdo = Connection::get();
        $allowed = ['name', 'timezone', 'currency', 'business_type', 'logo_url'];
        $updates = [];
        $params = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $updates[] = "{$field} = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($updates)) {
            return $this->get($workspaceId);
        }

        $now = current_timestamp();
        $updates[] = "updated_at = ?";
        $params[] = $now;
        $params[] = $workspaceId;

        $sql = "UPDATE workspaces SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return $this->get($workspaceId);
    }

    public function getMembers(string $workspaceId): array
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare("
            SELECT wm.id as membership_id, wm.role, wm.created_at as joined_at,
                   u.id as user_id, u.name, u.email, u.avatar_url
            FROM workspace_members wm
            JOIN users u ON wm.user_id = u.id
            WHERE wm.workspace_id = ?
            ORDER BY wm.created_at ASC
        ");
        $stmt->execute([$workspaceId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function inviteMember(string $workspaceId, string $email, string $role): array
    {
        $email = strtolower(trim($email));
        $validRoles = ['admin', 'member', 'viewer'];
        if (!in_array($role, $validRoles, true)) {
            throw new RuntimeException("Invalid role specified. Allowed: admin, member, viewer", 422);
        }

        $pdo = Connection::get();
        $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            throw new RuntimeException("User with email {$email} does not exist in JidoSapp yet.", 404);
        }

        $userId = $user['id'];
        $check = $pdo->prepare("SELECT id FROM workspace_members WHERE workspace_id = ? AND user_id = ?");
        $check->execute([$workspaceId, $userId]);
        if ($check->fetch()) {
            throw new RuntimeException("User is already a member of this workspace", 409);
        }

        $id = uuid_v4();
        $now = current_timestamp();
        $ins = $pdo->prepare("
            INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $ins->execute([$id, $workspaceId, $userId, $role, $now, $now]);

        AuditLogService::log($workspaceId, null, 'member_invited', 'workspace_members', $id, [
            'invited_user_id' => $userId,
            'role'            => $role,
        ]);

        return [
            'membership_id' => $id,
            'user'          => $user,
            'role'          => $role,
        ];
    }

    public function updateMemberRole(string $workspaceId, string $targetUserId, string $newRole): void
    {
        $validRoles = ['admin', 'member', 'viewer'];
        if (!in_array($newRole, $validRoles, true)) {
            throw new RuntimeException("Invalid role", 422);
        }

        $pdo = Connection::get();

        // Check if target is owner
        $stmt = $pdo->prepare("SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?");
        $stmt->execute([$workspaceId, $targetUserId]);
        $currentRole = $stmt->fetchColumn();

        if ($currentRole === 'owner') {
            throw new RuntimeException("Cannot alter owner role. Transfer workspace ownership instead.", 403);
        }

        $update = $pdo->prepare("UPDATE workspace_members SET role = ?, updated_at = ? WHERE workspace_id = ? AND user_id = ?");
        $update->execute([$newRole, current_timestamp(), $workspaceId, $targetUserId]);
    }

    public function removeMember(string $workspaceId, string $targetUserId): void
    {
        $pdo = Connection::get();
        $stmt = $pdo->prepare("SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?");
        $stmt->execute([$workspaceId, $targetUserId]);
        $role = $stmt->fetchColumn();

        if ($role === 'owner') {
            throw new RuntimeException("Workspace owner cannot be removed", 403);
        }

        $del = $pdo->prepare("DELETE FROM workspace_members WHERE workspace_id = ? AND user_id = ?");
        $del->execute([$workspaceId, $targetUserId]);
    }

    public function delete(string $workspaceId): void
    {
        $pdo = Connection::get();
        $del = $pdo->prepare("DELETE FROM workspaces WHERE id = ?");
        $del->execute([$workspaceId]);
    }

    public function checkSubdomainAvailability(string $subdomain): array
    {
        $slug = strtolower(trim($subdomain));
        $slug = preg_replace('/[^a-z0-9-]/', '', $slug);

        if (strlen($slug) < 3) {
            return [
                'available' => false,
                'subdomain' => $slug,
                'fqdn' => ($slug ?: 'subdomain') . '.jidosaap.xyz',
                'reason' => 'Subdomain must be at least 3 characters long',
            ];
        }

        $reserved = [
            'www', 'api', 'app', 'admin', 'auth', 'billing', 'mail', 'smtp',
            'support', 'dashboard', 'status', 'bot', 'system', 'root', 'static', 'cdn'
        ];

        if (in_array($slug, $reserved, true)) {
            return [
                'available' => false,
                'subdomain' => $slug,
                'fqdn' => "{$slug}.jidosaap.xyz",
                'reason' => 'This subdomain name is reserved by system',
            ];
        }

        $pdo = Connection::get();

        // Check active workspaces
        $stmt = $pdo->prepare("SELECT 1 FROM workspaces WHERE slug = ?");
        $stmt->execute([$slug]);
        if ($stmt->fetch()) {
            return [
                'available' => false,
                'subdomain' => $slug,
                'fqdn' => "{$slug}.jidosaap.xyz",
                'reason' => 'Subdomain is already claimed by an active workspace',
            ];
        }

        return [
            'available' => true,
            'subdomain' => $slug,
            'fqdn' => "{$slug}.jidosaap.xyz",
            'reason' => 'Subdomain is available for reservation',
        ];
    }

    public function createIntegrationRequest(array $data): array
    {
        $name = trim((string)($data['full_name'] ?? ''));
        $email = strtolower(trim((string)($data['email'] ?? '')));
        $phone = trim((string)($data['phone_number'] ?? ''));
        $brand = trim((string)($data['brand_name'] ?? ''));
        $subdomain = strtolower(trim((string)($data['subdomain'] ?? '')));
        $subdomain = preg_replace('/[^a-z0-9-]/', '', $subdomain);
        $useCase = trim((string)($data['use_case'] ?? 'custom'));
        $notes = trim((string)($data['notes'] ?? ''));

        if (empty($name) || empty($email) || empty($phone) || empty($subdomain)) {
            throw new RuntimeException("Name, email, phone number, and subdomain are required", 422);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException("Valid email address is required", 422);
        }

        $check = $this->checkSubdomainAvailability($subdomain);
        if (!$check['available']) {
            throw new RuntimeException($check['reason'], 409);
        }

        $pdo = Connection::get();
        $id = uuid_v4();
        $now = current_timestamp();

        $stmt = $pdo->prepare("
            INSERT INTO integration_requests (id, full_name, email, phone_number, brand_name, subdomain, use_case, notes, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
        ");
        $stmt->execute([$id, $name, $email, $phone, $brand ?: $name, $subdomain, $useCase, $notes, $now, $now]);

        return [
            'id' => $id,
            'full_name' => $name,
            'email' => $email,
            'phone_number' => $phone,
            'brand_name' => $brand,
            'subdomain' => $subdomain,
            'fqdn' => "{$subdomain}.jidosaap.xyz",
            'use_case' => $useCase,
            'status' => 'pending',
            'created_at' => $now,
            'message' => "Your dedicated WhatsApp instance on {$subdomain}.jidosaap.xyz is queued for provisioning!",
        ];
    }
}
