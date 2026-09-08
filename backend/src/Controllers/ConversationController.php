<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\ConversationService;
use Throwable;

final class ConversationController
{
    private ConversationService $service;

    public function __construct()
    {
        $this->service = new ConversationService();
    }

    public function index(Request $request, Response $response): void
    {
        $wsId    = $request->workspaceId();
        $filters = [
            'status'       => $request->query('status'),
            'handler_mode' => $request->query('handler_mode'),
            'search'       => $request->query('search'),
            'unread_only'  => $request->query('unread_only') === 'true',
            'page'         => $request->query('page', 1),
            'limit'        => $request->query('limit', 30),
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
        $wsId   = $request->workspaceId();
        $convId = $request->routeParam('id');

        try {
            $conv = $this->service->get($wsId, $convId);
            $response->json($conv)->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 500;
            $response->error('NOT_FOUND', $e->getMessage(), $code)->send();
        }
    }

    public function messages(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $convId = $request->routeParam('id');
        $page   = (int) $request->query('page', 1);
        $limit  = (int) $request->query('limit', 50);

        try {
            $result = $this->service->getMessages($wsId, $convId, $page, $limit);
            $response->json($result)->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 500;
            $response->error('FETCH_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function sendMessage(Request $request, Response $response): void
    {
        $wsId    = $request->workspaceId();
        $convId  = $request->routeParam('id');
        $content = (string) $request->input('content', '');
        $type    = (string) $request->input('type', 'text');

        if (empty($content)) {
            $response->error('VALIDATION_ERROR', 'Message content is required', 422)->send();
            return;
        }

        try {
            $msg = $this->service->sendMessage($wsId, $convId, $content, $type);
            $response->json($msg, 201, 'Message queued for delivery')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 500;
            $response->error('SEND_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function addNote(Request $request, Response $response): void
    {
        $wsId    = $request->workspaceId();
        $convId  = $request->routeParam('id');
        $content = (string) $request->input('content', '');
        $userId  = $request->userId() ?? '';

        if (empty($content)) {
            $response->error('VALIDATION_ERROR', 'Note content is required', 422)->send();
            return;
        }

        try {
            $note = $this->service->addNote($wsId, $convId, $content, $userId);
            $response->json($note, 201)->send();
        } catch (Throwable $e) {
            $response->error('NOTE_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function updateStatus(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $convId = $request->routeParam('id');
        $status = (string) $request->input('status', '');

        try {
            $conv = $this->service->updateStatus($wsId, $convId, $status);
            $response->json($conv, 200, 'Status updated')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('UPDATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function handoff(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $convId = $request->routeParam('id');
        $mode   = (string) $request->input('mode', 'human');

        try {
            $conv = $this->service->updateHandlerMode($wsId, $convId, $mode);
            $response->json($conv, 200, "Conversation handed to {$mode}")->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('HANDOFF_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function assign(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $convId = $request->routeParam('id');
        $userId = $request->input('user_id');

        try {
            $conv = $this->service->assign($wsId, $convId, $userId);
            $response->json($conv, 200, 'Conversation assigned')->send();
        } catch (Throwable $e) {
            $response->error('ASSIGN_FAILED', $e->getMessage(), 500)->send();
        }
    }
}
