<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\ContentService;
use Throwable;

final class ContentController
{
    private ContentService $service;

    public function __construct()
    {
        $this->service = new ContentService();
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
        $wsId      = $request->workspaceId();
        $contentId = $request->routeParam('id');

        try {
            $content = $this->service->get($wsId, $contentId);
            $response->json($content)->send();
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
            $contentId = $this->service->create($wsId, $userId, $request->all());
            $content   = $this->service->get($wsId, $contentId);
            $response->json($content, 201, 'Content created')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('CREATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function update(Request $request, Response $response): void
    {
        $wsId      = $request->workspaceId();
        $contentId = $request->routeParam('id');

        try {
            $content = $this->service->update($wsId, $contentId, $request->all());
            $response->json($content, 200, 'Content updated')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('UPDATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function destroy(Request $request, Response $response): void
    {
        $wsId      = $request->workspaceId();
        $contentId = $request->routeParam('id');

        try {
            $this->service->delete($wsId, $contentId);
            $response->json(['deleted' => true])->send();
        } catch (Throwable $e) {
            $response->error('DELETE_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function schedule(Request $request, Response $response): void
    {
        $wsId      = $request->workspaceId();
        $contentId = $request->routeParam('id');

        try {
            $sp = $this->service->schedulePost($wsId, $contentId, $request->all());
            $response->json($sp, 201, 'Content scheduled')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('SCHEDULE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function cancelSchedule(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $postId = $request->routeParam('id');

        try {
            $this->service->cancelScheduled($wsId, $postId);
            $response->json(['cancelled' => true])->send();
        } catch (Throwable $e) {
            $response->error('CANCEL_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function calendar(Request $request, Response $response): void
    {
        $wsId  = $request->workspaceId();
        $start = $request->query('start', date('Y-m-01 00:00:00'));
        $end   = $request->query('end', date('Y-m-t 23:59:59'));

        try {
            $events = $this->service->getCalendar($wsId, $start, $end);
            $response->json($events)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    // =========== Templates ===========

    public function templates(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        try {
            $templates = $this->service->getTemplates($wsId);
            $response->json($templates)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function storeTemplate(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        try {
            $template = $this->service->createTemplate($wsId, $request->all());
            $response->json($template, 201, 'Template created')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('CREATE_FAILED', $e->getMessage(), $code)->send();
        }
    }
}
