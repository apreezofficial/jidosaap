<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Database\Connection;
use App\Routing\Request;
use App\Routing\Response;
use PDO;

final class TenantMiddleware implements MiddlewareInterface
{
    public function handle(Request $request, Response $response, callable $next): void
    {
        $userId = $request->userId();
        if (!$userId) {
            $response->error('UNAUTHORIZED', 'Authentication required prior to workspace resolution', 401)->send();
            return;
        }

        $workspaceId = $request->header('x-workspace-id');
        $pdo = Connection::get();

        if (empty($workspaceId)) {
            // Find user's first/default workspace
            $stmt = $pdo->prepare("
                SELECT w.*, wm.role 
                FROM workspaces w
                JOIN workspace_members wm ON w.id = wm.workspace_id
                WHERE wm.user_id = ?
                ORDER BY wm.created_at ASC
                LIMIT 1
            ");
            $stmt->execute([$userId]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                $response->error('NO_WORKSPACE', 'No active workspace found for user. Please create one.', 404)->send();
                return;
            }

            $role = $row['role'];
            unset($row['role']);
            $request->setWorkspace($row, $role);
            $next($request, $response);
            return;
        }

        // Verify membership in specified workspace
        $stmt = $pdo->prepare("
            SELECT w.*, wm.role 
            FROM workspaces w
            JOIN workspace_members wm ON w.id = wm.workspace_id
            WHERE w.id = ? AND wm.user_id = ?
        ");
        $stmt->execute([$workspaceId, $userId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            $response->error('FORBIDDEN', 'You do not have access to this workspace.', 403)->send();
            return;
        }

        $role = $row['role'];
        unset($row['role']);
        $request->setWorkspace($row, $role);

        $next($request, $response);
    }
}
