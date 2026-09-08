<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Routing\Request;
use App\Routing\Response;

interface MiddlewareInterface
{
    /**
     * Process an incoming request. Call $next($request, $response) to continue pipeline.
     *
     * @param Request $request
     * @param Response $response
     * @param callable $next
     * @return void
     */
    public function handle(Request $request, Response $response, callable $next): void;
}
