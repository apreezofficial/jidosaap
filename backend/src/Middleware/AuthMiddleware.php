<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Database\Connection;
use App\Routing\Request;
use App\Routing\Response;
use App\Security\TokenService;
use PDO;

final class AuthMiddleware implements MiddlewareInterface
{
    public function handle(Request $request, Response $response, callable $next): void
    {
        $authHeader = $request->header('authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            $response->error('UNAUTHORIZED', 'Missing or invalid Authorization header', 401)->send();
            return;
        }

        $token = substr($authHeader, 7);
        $payload = TokenService::verifyToken($token);

        if (!$payload || empty($payload['sub'])) {
            $response->error('UNAUTHORIZED', 'Invalid or expired authentication token', 401)->send();
            return;
        }

        $userId = (string) $payload['sub'];
        $pdo = Connection::get();
        $stmt = $pdo->prepare("SELECT id, name, email, avatar_url, status, email_verified_at FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || ($user['status'] ?? 'active') !== 'active') {
            $response->error('UNAUTHORIZED', 'User not found or account is deactivated', 401)->send();
            return;
        }

        $request->setUser($user);
        $next($request, $response);
    }
}
