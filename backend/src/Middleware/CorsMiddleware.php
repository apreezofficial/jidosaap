<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Config\AppConfig;
use App\Routing\Request;
use App\Routing\Response;

final class CorsMiddleware implements MiddlewareInterface
{
    public function handle(Request $request, Response $response, callable $next): void
    {
        $origin = $request->header('origin', '*');
        $allowedOrigin = $origin ?: '*';

        header("Access-Control-Allow-Origin: {$allowedOrigin}");
        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Workspace-Id, X-Requested-With, Cache-Control");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400");

        // If preflight OPTIONS request, return 204 immediately
        if ($request->method() === 'OPTIONS') {
            http_response_code(204);
            exit;
        }

        $next($request, $response);
    }
}
