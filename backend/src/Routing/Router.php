<?php

declare(strict_types=1);

namespace App\Routing;

use App\Config\AppConfig;
use App\Middleware\MiddlewareInterface;
use Throwable;

final class Router
{
    private array $routes = [];
    private array $groupPrefixes = [];
    private array $groupMiddlewares = [];

    public function group(string $prefix, array $middlewares, callable $callback): void
    {
        $this->groupPrefixes[] = '/' . trim($prefix, '/');
        $this->groupMiddlewares[] = $middlewares;

        $callback($this);

        array_pop($this->groupPrefixes);
        array_pop($this->groupMiddlewares);
    }

    public function get(string $path, mixed $handler, array $middlewares = []): void
    {
        $this->addRoute('GET', $path, $handler, $middlewares);
    }

    public function post(string $path, mixed $handler, array $middlewares = []): void
    {
        $this->addRoute('POST', $path, $handler, $middlewares);
    }

    public function patch(string $path, mixed $handler, array $middlewares = []): void
    {
        $this->addRoute('PATCH', $path, $handler, $middlewares);
    }

    public function put(string $path, mixed $handler, array $middlewares = []): void
    {
        $this->addRoute('PUT', $path, $handler, $middlewares);
    }

    public function delete(string $path, mixed $handler, array $middlewares = []): void
    {
        $this->addRoute('DELETE', $path, $handler, $middlewares);
    }

    public function options(string $path, mixed $handler, array $middlewares = []): void
    {
        $this->addRoute('OPTIONS', $path, $handler, $middlewares);
    }

    private function addRoute(string $method, string $path, mixed $handler, array $middlewares): void
    {
        $fullPrefix = implode('', $this->groupPrefixes);
        $fullPath = '/' . trim($fullPrefix . '/' . trim($path, '/'), '/');
        if ($fullPath === '//') {
            $fullPath = '/';
        }

        $allMiddlewares = [];
        foreach ($this->groupMiddlewares as $groupMw) {
            $allMiddlewares = array_merge($allMiddlewares, $groupMw);
        }
        $allMiddlewares = array_merge($allMiddlewares, $middlewares);

        // Convert path to regex pattern
        // e.g., /api/v1/contacts/:id -> ^/api/v1/contacts/(?P<id>[^/]+)$
        $paramNames = [];
        $pattern = preg_replace_callback('/:([a-zA-Z0-9_]+)/', function ($matches) use (&$paramNames) {
            $paramNames[] = $matches[1];
            return '(?P<' . $matches[1] . '>[^/]+)';
        }, $fullPath);

        $regex = '#^' . $pattern . '$#';

        $this->routes[] = [
            'method'      => $method,
            'path'        => $fullPath,
            'regex'       => $regex,
            'paramNames'  => $paramNames,
            'handler'     => $handler,
            'middlewares' => $allMiddlewares,
        ];
    }

    public function dispatch(Request $request, Response $response): void
    {
        try {
            $method = $request->method();
            $uri = $request->uri();

            foreach ($this->routes as $route) {
                if ($route['method'] !== $method) {
                    continue;
                }

                if (preg_match($route['regex'], $uri, $matches)) {
                    $params = [];
                    foreach ($route['paramNames'] as $paramName) {
                        if (isset($matches[$paramName])) {
                            $params[$paramName] = urldecode($matches[$paramName]);
                        }
                    }
                    $request->setRouteParams($params);

                    // Build middleware pipeline
                    $this->runPipeline($route['middlewares'], $request, $response, function () use ($route, $request, $response) {
                        $handler = $route['handler'];

                        if (is_callable($handler)) {
                            $result = $handler($request, $response);
                        } elseif (is_array($handler) && count($handler) === 2) {
                            [$class, $method] = $handler;
                            $controller = new $class();
                            $result = $controller->$method($request, $response);
                        } else {
                            throw new \RuntimeException("Invalid route handler format");
                        }

                        if ($result instanceof Response) {
                            $result->send();
                        }
                    });

                    return;
                }
            }

            // Route not found
            $response->error('NOT_FOUND', "Endpoint {$method} {$uri} not found", 404)->send();
        } catch (Throwable $e) {
            $this->handleException($e, $response);
        }
    }

    private function runPipeline(array $middlewares, Request $request, Response $response, callable $target): void
    {
        $pipeline = array_reduce(
            array_reverse($middlewares),
            function ($next, $middleware) {
                return function (Request $req, Response $res) use ($next, $middleware) {
                    if (is_string($middleware)) {
                        $middleware = new $middleware();
                    }

                    if ($middleware instanceof MiddlewareInterface) {
                        $middleware->handle($req, $res, $next);
                    } elseif (is_callable($middleware)) {
                        $middleware($req, $res, $next);
                    } else {
                        throw new \RuntimeException("Invalid middleware type");
                    }
                };
            },
            $target
        );

        $pipeline($request, $response);
    }

    private function handleException(Throwable $e, Response $response): void
    {
        $code = $e->getCode();
        $statusCode = ($code >= 400 && $code < 600) ? (int) $code : 500;

        $isDebug = AppConfig::isDebug();
        $message = ($statusCode >= 500 && !$isDebug) ? 'An internal server error occurred.' : $e->getMessage();

        $errorData = [
            'code'    => 'SERVER_ERROR',
            'message' => $message,
            'fields'  => [],
        ];

        if ($isDebug) {
            $errorData['debug'] = [
                'file'  => $e->getFile(),
                'line'  => $e->getLine(),
                'trace' => array_slice(explode("\n", $e->getTraceAsString()), 0, 5),
            ];
        }

        $response->error('SERVER_ERROR', $message, $statusCode, $errorData)->send();
    }
}
