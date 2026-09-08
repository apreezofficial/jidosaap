<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\WhatsAppConnectionService;
use Throwable;

final class WhatsAppController
{
    private WhatsAppConnectionService $service;

    public function __construct()
    {
        $this->service = new WhatsAppConnectionService();
    }

    public function index(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        try {
            $connections = $this->service->list($wsId);
            $response->json($connections)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function show(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $connectionId = $request->routeParam('id');

        try {
            $conn = $this->service->get($wsId, $connectionId);
            $response->json($conn)->send();
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
            $conn = $this->service->create($wsId, $userId, $request->all());
            $response->json($conn, 201, 'WhatsApp connection created')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('CREATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function update(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $connectionId = $request->routeParam('id');

        try {
            $conn = $this->service->update($wsId, $connectionId, $request->all());
            $response->json($conn, 200, 'Connection updated')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('UPDATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function disconnect(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $connectionId = $request->routeParam('id');
        $userId       = $request->userId() ?? '';

        try {
            $this->service->disconnect($wsId, $connectionId, $userId);
            $response->json(['disconnected' => true], 200, 'Connection disconnected')->send();
        } catch (Throwable $e) {
            $response->error('DISCONNECT_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function destroy(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $connectionId = $request->routeParam('id');
        $userId       = $request->userId() ?? '';

        try {
            $this->service->delete($wsId, $connectionId, $userId);
            $response->json(['deleted' => true])->send();
        } catch (Throwable $e) {
            $response->error('DELETE_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function test(Request $request, Response $response): void
    {
        $wsId         = $request->workspaceId();
        $connectionId = $request->routeParam('id');

        try {
            $result = $this->service->testConnection($wsId, $connectionId);
            $response->json($result)->send();
        } catch (Throwable $e) {
            $response->error('TEST_FAILED', $e->getMessage(), 500)->send();
        }
    }
}
