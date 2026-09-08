<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\AgentService;
use Throwable;

final class AgentController
{
    private AgentService $service;

    public function __construct()
    {
        $this->service = new AgentService();
    }

    public function index(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        try {
            $agents = $this->service->list($wsId);
            $response->json($agents)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function show(Request $request, Response $response): void
    {
        $wsId    = $request->workspaceId();
        $agentId = $request->routeParam('id');
        try {
            $agent = $this->service->get($wsId, $agentId);
            $response->json($agent)->send();
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
            $agentId = $this->service->create($wsId, $userId, $request->all());
            $agent   = $this->service->get($wsId, $agentId);
            $response->json($agent, 201, 'AI agent created')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('CREATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function update(Request $request, Response $response): void
    {
        $wsId    = $request->workspaceId();
        $agentId = $request->routeParam('id');
        $userId  = $request->userId() ?? '';
        try {
            $agent = $this->service->update($wsId, $agentId, $request->all(), $userId);
            $response->json($agent, 200, 'Agent updated')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('UPDATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function destroy(Request $request, Response $response): void
    {
        $wsId    = $request->workspaceId();
        $agentId = $request->routeParam('id');
        try {
            $this->service->delete($wsId, $agentId);
            $response->json(['deleted' => true])->send();
        } catch (Throwable $e) {
            $response->error('DELETE_FAILED', $e->getMessage(), 500)->send();
        }
    }

    // =========== Knowledge Base ===========

    public function knowledgeBases(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        try {
            $kbs = $this->service->getKnowledgeBases($wsId);
            $response->json($kbs)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function storeKnowledgeBase(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $userId = $request->userId() ?? '';
        try {
            $kb = $this->service->createKnowledgeBase($wsId, $userId, $request->all());
            $response->json($kb, 201, 'Knowledge base created')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('CREATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function documents(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        $kbId = $request->routeParam('kbId');
        try {
            $docs = $this->service->getDocuments($wsId, $kbId);
            $response->json($docs)->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 500;
            $response->error('FETCH_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function storeDocument(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        $kbId = $request->routeParam('kbId');
        try {
            $doc = $this->service->addDocument($wsId, $kbId, $request->all());
            $response->json($doc, 201, 'Document queued for processing')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('UPLOAD_FAILED', $e->getMessage(), $code)->send();
        }
    }
}
