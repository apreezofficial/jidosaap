<?php

declare(strict_types=1);

namespace App\Routing;

final class Request
{
    private string $method;
    private string $uri;
    private array $headers = [];
    private array $queryParams = [];
    private array $body = [];
    private array $routeParams = [];
    private ?array $user = null;
    private ?array $workspace = null;
    private ?string $role = null;

    public function __construct()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        
        $requestUri = $_SERVER['REQUEST_URI'] ?? '/';
        $uriParts = explode('?', $requestUri, 2);
        $this->uri = '/' . trim($uriParts[0], '/');
        if ($this->uri === '//') {
            $this->uri = '/';
        }

        $this->queryParams = $_GET;

        // Parse all request headers
        if (function_exists('getallheaders')) {
            $rawHeaders = getallheaders();
            foreach ($rawHeaders as $key => $val) {
                $this->headers[strtolower($key)] = $val;
            }
        } else {
            foreach ($_SERVER as $key => $val) {
                if (str_starts_with($key, 'HTTP_')) {
                    $headerName = strtolower(str_replace('_', '-', substr($key, 5)));
                    $this->headers[$headerName] = $val;
                }
            }
        }

        // Parse body (JSON or form-urlencoded)
        $contentType = $this->header('content-type', '');
        if (str_contains($contentType, 'application/json')) {
            $rawInput = file_get_contents('php://input');
            if (!empty($rawInput)) {
                $decoded = json_decode($rawInput, true);
                $this->body = is_array($decoded) ? $decoded : [];
            }
        } else {
            $this->body = $_POST;
        }
    }

    public function method(): string
    {
        return $this->method;
    }

    public function uri(): string
    {
        return $this->uri;
    }

    public function header(string $key, ?string $default = null): ?string
    {
        return $this->headers[strtolower($key)] ?? $default;
    }

    public function headers(): array
    {
        return $this->headers;
    }

    public function query(?string $key = null, mixed $default = null): mixed
    {
        if ($key === null) {
            return $this->queryParams;
        }
        return $this->queryParams[$key] ?? $default;
    }

    public function input(?string $key = null, mixed $default = null): mixed
    {
        if ($key === null) {
            return array_merge($this->queryParams, $this->body);
        }
        return $this->body[$key] ?? $this->queryParams[$key] ?? $default;
    }

    public function all(): array
    {
        return array_merge($this->queryParams, $this->body);
    }

    public function rawBody(): string
    {
        return file_get_contents('php://input') ?: '';
    }

    public function setRouteParams(array $params): void
    {
        $this->routeParams = $params;
    }

    public function param(string $key, ?string $default = null): ?string
    {
        return $this->routeParams[$key] ?? $default;
    }

    /**
     * Alias for param() — used by controllers to fetch route parameters like :id
     */
    public function routeParam(string $key, ?string $default = null): ?string
    {
        return $this->routeParams[$key] ?? $default;
    }

    public function setUser(?array $user): void
    {
        $this->user = $user;
    }

    public function user(): ?array
    {
        return $this->user;
    }

    public function userId(): ?string
    {
        return $this->user['id'] ?? null;
    }

    public function setWorkspace(?array $workspace, ?string $role = null): void
    {
        $this->workspace = $workspace;
        $this->role = $role;
    }

    public function workspace(): ?array
    {
        return $this->workspace;
    }

    public function workspaceId(): ?string
    {
        return $this->workspace['id'] ?? null;
    }

    public function role(): ?string
    {
        return $this->role;
    }
}
