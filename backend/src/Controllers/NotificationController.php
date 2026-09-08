<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\NotificationService;
use Throwable;

final class NotificationController
{
    private NotificationService $service;

    public function __construct()
    {
        $this->service = new NotificationService();
    }

    public function index(Request $request, Response $response): void
    {
        $wsId        = $request->workspaceId();
        $userId      = $request->userId() ?? '';
        $unreadOnly  = $request->query('unread') === 'true';

        try {
            $notifications = $this->service->getForUser($wsId, $userId, $unreadOnly);
            $unreadCount   = $this->service->getUnreadCount($wsId, $userId);
            $response->json(['notifications' => $notifications, 'unread_count' => $unreadCount])->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function markRead(Request $request, Response $response): void
    {
        $wsId  = $request->workspaceId();
        $userId = $request->userId() ?? '';
        $id    = $request->routeParam('id');

        try {
            $this->service->markRead($wsId, $userId, $id ?: null);
            $response->json(['marked' => true])->send();
        } catch (Throwable $e) {
            $response->error('MARK_FAILED', $e->getMessage(), 500)->send();
        }
    }
}
