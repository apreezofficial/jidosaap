<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class AuditLogService
{
    public static function log(
        string $workspaceId,
        ?string $userId,
        string $action,
        string $resourceType,
        ?string $resourceId = null,
        array $metadata = []
    ): void {
        try {
            $pdo = Connection::get();
            $stmt = $pdo->prepare("
                INSERT INTO audit_logs (id, workspace_id, user_id, action, resource_type, resource_id, metadata, ip_address, user_agent, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                uuid_v4(),
                $workspaceId,
                $userId,
                $action,
                $resourceType,
                $resourceId,
                json_encode($metadata),
                $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
                $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
                current_timestamp(),
            ]);
        } catch (\Throwable) {
            // Fail silently so auditing never breaks user workflow
        }
    }
}
