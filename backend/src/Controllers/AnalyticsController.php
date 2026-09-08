<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\AnalyticsService;
use Throwable;

final class AnalyticsController
{
    private AnalyticsService $service;

    public function __construct()
    {
        $this->service = new AnalyticsService();
    }

    public function dashboard(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $period = $request->query('period', '7d');

        try {
            $stats = $this->service->getDashboardStats($wsId, $period);
            $response->json($stats)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function messages(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $period = $request->query('period', '7d');

        try {
            $series = $this->service->getMessageSeries($wsId, $period);
            $response->json($series)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function leads(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $period = $request->query('period', '30d');

        try {
            $series   = $this->service->getLeadSeries($wsId, $period);
            $pipeline = $this->service->getLeadPipeline($wsId);
            $response->json(['series' => $series, 'pipeline' => $pipeline])->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function automations(Request $request, Response $response): void
    {
        $wsId   = $request->workspaceId();
        $period = $request->query('period', '7d');

        try {
            $series = $this->service->getAutomationSeries($wsId, $period);
            $response->json($series)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function activity(Request $request, Response $response): void
    {
        $wsId  = $request->workspaceId();
        $limit = (int) $request->query('limit', 20);

        try {
            $activity = $this->service->getRecentActivity($wsId, $limit);
            $response->json($activity)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function usage(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        try {
            $usage = $this->service->getUsageSummary($wsId);
            $response->json($usage)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }
}
