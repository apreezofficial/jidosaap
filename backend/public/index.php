<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Routing\Request;
use App\Routing\Response;
use App\Routing\Router;
use App\Middleware\CorsMiddleware;

// Load environment variables
if (file_exists(dirname(__DIR__) . '/.env')) {
    $dotenv = Dotenv::createImmutable(dirname(__DIR__));
    $dotenv->safeLoad();
}

$request = new Request();
$response = new Response();
$router = new Router();

// Apply global CORS middleware before all routes
(new CorsMiddleware())->handle($request, $response, function (Request $req, Response $res) use ($router) {
    // Load route definition files
    require_once dirname(__DIR__) . '/routes/api.php';
    require_once dirname(__DIR__) . '/routes/webhooks.php';

    // Dispatch request through router
    $router->dispatch($req, $res);
});
