<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Routing\Request;
use App\Routing\Response;
use App\Security\RateLimiter;

final class RateLimitMiddleware implements MiddlewareInterface
{
    public function __construct(
        private int $maxAttempts = 60,
        private int $decaySeconds = 60,
        private string $prefix = 'api'
    ) {
    }

    public function handle(Request $request, Response $response, callable $next): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $key = "{$this->prefix}:{$ip}";

        if (!RateLimiter::check($key, $this->maxAttempts, $this->decaySeconds)) {
            $response->error(
                'RATE_LIMITED',
                'Too many requests. Please slow down and try again later.',
                429
            )->send();
            return;
        }

        $next($request, $response);
    }
}
