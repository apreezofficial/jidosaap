<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\CrmService;
use Throwable;

final class CrmController
{
    private CrmService $service;

    public function __construct()
    {
        $this->service = new CrmService();
    }

    // ============ Leads ============

    public function leads(Request $request, Response $response): void
    {
        $wsId    = $request->workspaceId();
        $filters = [
            'stage'            => $request->query('stage'),
            'search'           => $request->query('search'),
            'assigned_user_id' => $request->query('assigned_user_id'),
        ];

        try {
            $leads = $this->service->listLeads($wsId, array_filter($filters, fn($v) => $v !== null && $v !== ''));
            $response->json($leads)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function pipelineBoard(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        try {
            $board = $this->service->getPipelineBoard($wsId);
            $response->json($board)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function getLead(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $leadId = $request->routeParam('id');

        try {
            $lead = $this->service->getLead($wsId, $leadId);
            $response->json($lead)->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 500;
            $response->error('NOT_FOUND', $e->getMessage(), $code)->send();
        }
    }

    public function storeLead(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $userId = $request->userId() ?? '';

        try {
            $lead = $this->service->createLead($wsId, $userId, $request->all());
            $response->json($lead, 201, 'Lead created')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('CREATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function updateLead(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $leadId = $request->routeParam('id');
        $userId = $request->userId() ?? '';

        try {
            $lead = $this->service->updateLead($wsId, $leadId, $request->all(), $userId);
            $response->json($lead, 200, 'Lead updated')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('UPDATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function deleteLead(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $leadId = $request->routeParam('id');

        try {
            $this->service->deleteLead($wsId, $leadId);
            $response->json(['deleted' => true])->send();
        } catch (Throwable $e) {
            $response->error('DELETE_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function addLeadNote(Request $request, Response $response): void
    {
        $wsId    = $request->workspaceId();
        $leadId  = $request->routeParam('id');
        $content = (string) $request->input('content', '');
        $userId  = $request->userId() ?? '';

        if (empty($content)) {
            $response->error('VALIDATION_ERROR', 'Note content is required', 422)->send();
            return;
        }

        try {
            $note = $this->service->addNote($wsId, $leadId, $content, $userId);
            $response->json($note, 201)->send();
        } catch (Throwable $e) {
            $response->error('NOTE_FAILED', $e->getMessage(), 500)->send();
        }
    }
}
