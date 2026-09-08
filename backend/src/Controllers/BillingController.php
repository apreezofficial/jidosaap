<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\BillingService;
use Throwable;

final class BillingController
{
    private BillingService $service;

    public function __construct()
    {
        $this->service = new BillingService();
    }

    public function plans(Request $request, Response $response): void
    {
        try {
            $plans = $this->service->getPlans();
            $response->json($plans)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function subscription(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        try {
            $sub = $this->service->getSubscription($wsId);
            $response->json($sub)->send();
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

    public function createCheckout(Request $request, Response $response): void
    {
        $wsId          = $request->workspaceId();
        $planId        = (string) $request->input('plan_id', '');
        $billingPeriod = (string) $request->input('billing_period', 'monthly');

        if (empty($planId)) {
            $response->error('VALIDATION_ERROR', 'Plan ID is required', 422)->send();
            return;
        }

        try {
            $session = $this->service->createCheckoutSession($wsId, $planId, $billingPeriod);
            $response->json($session)->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 500;
            $response->error('CHECKOUT_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function createPortal(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        try {
            $session = $this->service->createPortalSession($wsId);
            $response->json($session)->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 500;
            $response->error('PORTAL_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function stripeWebhook(Request $request, Response $response): void
    {
        $payload   = file_get_contents('php://input') ?: '';
        $signature = $request->header('stripe-signature') ?? '';

        if (empty($signature)) {
            $response->error('INVALID_SIGNATURE', 'Missing Stripe-Signature header', 400)->send();
            return;
        }

        try {
            $this->service->handleStripeWebhook($payload, $signature);
            $response->json(['received' => true])->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 500;
            $response->error('WEBHOOK_FAILED', $e->getMessage(), $code)->send();
        }
    }
}
