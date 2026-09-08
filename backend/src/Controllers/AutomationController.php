<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\AutomationService;
use Throwable;

final class AutomationController
{
    private AutomationService $service;

    public function __construct()
    {
        $this->service = new AutomationService();
    }

    public function index(Request $request, Response $response): void
    {
        $wsId    = $request->workspaceId();
        $filters = [
            'status' => $request->query('status'),
            'search' => $request->query('search'),
            'page'   => $request->query('page', 1),
            'limit'  => $request->query('limit', 20),
        ];

        try {
            $result = $this->service->list($wsId, array_filter($filters, fn($v) => $v !== null && $v !== ''));
            $response->json($result)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function show(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $automationId = $request->routeParam('id');

        try {
            $automation = $this->service->get($wsId, $automationId);
            $response->json($automation)->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 500;
            $response->error('NOT_FOUND', $e->getMessage(), $code)->send();
        }
    }

    public function store(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $userId = $request->userId() ?? '';

        try {
            $automationId = $this->service->create($wsId, $userId, $request->all());
            $automation   = $this->service->get($wsId, $automationId);
            $response->json($automation, 201, 'Automation created')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('CREATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function update(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $automationId = $request->routeParam('id');

        try {
            $this->service->update($wsId, $automationId, $request->all());
            $automation = $this->service->get($wsId, $automationId);
            $response->json($automation, 200, 'Automation updated')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('UPDATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function destroy(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $automationId = $request->routeParam('id');

        try {
            $this->service->delete($wsId, $automationId);
            $response->json(['deleted' => true])->send();
        } catch (Throwable $e) {
            $response->error('DELETE_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function enable(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $automationId = $request->routeParam('id');
        $userId       = $request->userId() ?? '';

        try {
            $automation = $this->service->setStatus($wsId, $automationId, 'active', $userId);
            $response->json($automation, 200, 'Automation enabled')->send();
        } catch (Throwable $e) {
            $response->error('ENABLE_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function disable(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $automationId = $request->routeParam('id');
        $userId       = $request->userId() ?? '';

        try {
            $automation = $this->service->setStatus($wsId, $automationId, 'inactive', $userId);
            $response->json($automation, 200, 'Automation disabled')->send();
        } catch (Throwable $e) {
            $response->error('DISABLE_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function runs(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $automationId = $request->routeParam('id');
        $page         = (int) $request->query('page', 1);
        $limit        = (int) $request->query('limit', 20);

        try {
            $result = $this->service->getRuns($wsId, $automationId, $page, $limit);
            $response->json($result)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    // ============ API Connections ============

    public function apiConnections(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        try {
            $connections = $this->service->getApiConnections($wsId);
            $response->json($connections)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function storeApiConnection(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $userId = $request->userId() ?? '';

        try {
            $connection = $this->service->createApiConnection($wsId, $userId, $request->all());
            $response->json($connection, 201, 'API connection created')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('CREATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function testApiConnection(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $connectionId = $request->routeParam('id');

        try {
            $result = $this->service->testApiConnection($wsId, $connectionId);
            $response->json($result)->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('TEST_FAILED', $e->getMessage(), $code)->send();
        }
    }
}
