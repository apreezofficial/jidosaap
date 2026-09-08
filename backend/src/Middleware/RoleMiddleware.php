<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\PermissionService;

final class RoleMiddleware implements MiddlewareInterface
{
    public function __construct(private string $permission)
    {
    }

    public function handle(Request $request, Response $response, callable $next): void
    {
        $role = $request->role();
        if (!$role) {
            $response->error('FORBIDDEN', 'Role not identified for workspace access', 403)->send();
            return;
        }

        if (!PermissionService::can($role, $this->permission)) {
            $response->error('FORBIDDEN', "You do not have permission [{$this->permission}] to perform this action", 403)->send();
            return;
        }

        $next($request, $response);
    }
}
