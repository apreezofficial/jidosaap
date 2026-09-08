<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use PDO;
use RuntimeException;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class BillingService
{
    public function getPlans(): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("SELECT * FROM plans WHERE is_active = 1 ORDER BY price_monthly ASC");
        $stmt->execute();
        $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($plans as &$plan) {
            $plan['limits'] = json_decode($plan['limits_json'], true);
            unset($plan['limits_json']);
        }

        return $plans;
    }

    public function getSubscription(string $workspaceId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT s.*, p.name AS plan_name, p.slug AS plan_slug,
                p.price_monthly, p.price_yearly, p.limits_json
            FROM subscriptions s
            JOIN plans p ON s.plan_id = p.id
            WHERE s.workspace_id = ?
        ");
        $stmt->execute([$workspaceId]);
        $sub = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$sub) {
            // Return a default free tier
            return [
                'workspace_id' => $workspaceId,
                'status'       => 'none',
                'plan_name'    => 'Free',
                'plan_slug'    => 'free',
                'price_monthly' => 0,
            ];
        }

        $sub['limits'] = json_decode($sub['limits_json'] ?? '{}', true);
        unset($sub['limits_json']);
        return $sub;
    }

    public function getUsageSummary(string $workspaceId): array
    {
        $pdo    = Connection::get();
        $period = date('Y-m');

        $stmt = $pdo->prepare("
            SELECT metric, SUM(quantity) AS total
            FROM usage_records
            WHERE workspace_id = ? AND period = ?
            GROUP BY metric
        ");
        $stmt->execute([$workspaceId, $period]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $usage = [];
        foreach ($rows as $row) {
            $usage[$row['metric']] = (int) $row['total'];
        }

        return ['period' => $period, 'usage' => $usage];
    }

    public function createCheckoutSession(string $workspaceId, string $planId, string $billingPeriod = 'monthly'): array
    {
        $stripeKey = getenv('STRIPE_SECRET_KEY');
        if (empty($stripeKey)) {
            throw new RuntimeException("Stripe is not configured", 503);
        }

        $pdo  = Connection::get();
        $stmt = $pdo->prepare("SELECT * FROM plans WHERE id = ? AND is_active = 1");
        $stmt->execute([$planId]);
        $plan = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$plan) {
            throw new RuntimeException("Plan not found", 404);
        }

        $priceId = $billingPeriod === 'yearly'
            ? $plan['stripe_price_id_yearly']
            : $plan['stripe_price_id_monthly'];

        if (empty($priceId)) {
            throw new RuntimeException("Stripe price not configured for this plan", 503);
        }

        // Get or create Stripe customer
        $subStmt = $pdo->prepare("SELECT stripe_customer_id FROM subscriptions WHERE workspace_id = ?");
        $subStmt->execute([$workspaceId]);
        $existingSub = $subStmt->fetch(PDO::FETCH_ASSOC);

        $appUrl = rtrim(getenv('APP_URL') ?: 'http://localhost:3000', '/');

        $payload = [
            'mode'                => 'subscription',
            'line_items'          => [['price' => $priceId, 'quantity' => 1]],
            'success_url'         => "{$appUrl}/settings/billing?session_id={CHECKOUT_SESSION_ID}",
            'cancel_url'          => "{$appUrl}/settings/billing",
            'metadata[workspace_id]' => $workspaceId,
            'metadata[plan_id]'   => $planId,
        ];

        if (!empty($existingSub['stripe_customer_id'])) {
            $payload['customer'] = $existingSub['stripe_customer_id'];
        }

        $ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($payload),
            CURLOPT_USERPWD        => "{$stripeKey}:",
            CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        $body     = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $response = json_decode($body, true);

        if ($httpCode !== 200 || empty($response['url'])) {
            throw new RuntimeException("Failed to create Stripe checkout session: " . ($response['error']['message'] ?? 'Unknown error'), 502);
        }

        return ['checkout_url' => $response['url'], 'session_id' => $response['id']];
    }

    public function createPortalSession(string $workspaceId): array
    {
        $stripeKey = getenv('STRIPE_SECRET_KEY');
        if (empty($stripeKey)) {
            throw new RuntimeException("Stripe is not configured", 503);
        }

        $pdo     = Connection::get();
        $subStmt = $pdo->prepare("SELECT stripe_customer_id FROM subscriptions WHERE workspace_id = ?");
        $subStmt->execute([$workspaceId]);
        $sub = $subStmt->fetch(PDO::FETCH_ASSOC);

        if (empty($sub['stripe_customer_id'])) {
            throw new RuntimeException("No Stripe customer found. Please upgrade to a paid plan first.", 400);
        }

        $appUrl = rtrim(getenv('APP_URL') ?: 'http://localhost:3000', '/');

        $ch = curl_init('https://api.stripe.com/v1/billing_portal/sessions');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query([
                'customer'   => $sub['stripe_customer_id'],
                'return_url' => "{$appUrl}/settings/billing",
            ]),
            CURLOPT_USERPWD    => "{$stripeKey}:",
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        $body     = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $response = json_decode($body, true);

        if ($httpCode !== 200 || empty($response['url'])) {
            throw new RuntimeException("Failed to create billing portal session", 502);
        }

        return ['portal_url' => $response['url']];
    }

    public function handleStripeWebhook(string $payload, string $signature): void
    {
        $webhookSecret = getenv('STRIPE_WEBHOOK_SECRET');
        if (empty($webhookSecret)) {
            throw new RuntimeException("Stripe webhook secret not configured", 500);
        }

        // Verify Stripe signature
        if (!$this->verifyStripeSignature($payload, $signature, $webhookSecret)) {
            throw new RuntimeException("Invalid Stripe webhook signature", 400);
        }

        $event = json_decode($payload, true);
        if (!$event) {
            throw new RuntimeException("Invalid webhook payload", 400);
        }

        $type   = $event['type'] ?? '';
        $object = $event['data']['object'] ?? [];

        switch ($type) {
            case 'checkout.session.completed':
                $this->handleCheckoutCompleted($object);
                break;

            case 'customer.subscription.updated':
            case 'customer.subscription.created':
                $this->handleSubscriptionUpdated($object);
                break;

            case 'customer.subscription.deleted':
                $this->handleSubscriptionCanceled($object);
                break;

            case 'invoice.payment_failed':
                $this->handlePaymentFailed($object);
                break;
        }
    }

    private function handleCheckoutCompleted(array $session): void
    {
        $workspaceId = $session['metadata']['workspace_id'] ?? null;
        $planId      = $session['metadata']['plan_id'] ?? null;
        $customerId  = $session['customer'] ?? null;
        $subId       = $session['subscription'] ?? null;

        if (!$workspaceId || !$planId) return;

        $pdo = Connection::get();
        $now = current_timestamp();

        // Upsert subscription
        $check = $pdo->prepare("SELECT id FROM subscriptions WHERE workspace_id = ?");
        $check->execute([$workspaceId]);
        $existing = $check->fetchColumn();

        if ($existing) {
            $upd = $pdo->prepare("
                UPDATE subscriptions
                SET plan_id = ?, stripe_customer_id = ?, stripe_subscription_id = ?,
                    status = 'active', updated_at = ?
                WHERE workspace_id = ?
            ");
            $upd->execute([$planId, $customerId, $subId, $now, $workspaceId]);
        } else {
            $id = uuid_v4();
            $ins = $pdo->prepare("
                INSERT INTO subscriptions
                    (id, workspace_id, plan_id, stripe_customer_id, stripe_subscription_id, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
            ");
            $ins->execute([$id, $workspaceId, $planId, $customerId, $subId, $now, $now]);
        }

        AuditLogService::log($workspaceId, null, 'subscription_activated', 'subscriptions', $workspaceId, ['plan_id' => $planId]);
    }

    private function handleSubscriptionUpdated(array $subscription): void
    {
        $stripeSubId = $subscription['id'] ?? null;
        $status      = $subscription['status'] ?? 'active';
        $periodStart = isset($subscription['current_period_start']) ? date('Y-m-d H:i:s', $subscription['current_period_start']) : null;
        $periodEnd   = isset($subscription['current_period_end']) ? date('Y-m-d H:i:s', $subscription['current_period_end']) : null;
        $cancelAtEnd = (int) ($subscription['cancel_at_period_end'] ?? 0);

        if (!$stripeSubId) return;

        $pdo = Connection::get();
        $upd = $pdo->prepare("
            UPDATE subscriptions
            SET status = ?, current_period_start = ?, current_period_end = ?,
                cancel_at_period_end = ?, updated_at = ?
            WHERE stripe_subscription_id = ?
        ");
        $upd->execute([$status, $periodStart, $periodEnd, $cancelAtEnd, current_timestamp(), $stripeSubId]);
    }

    private function handleSubscriptionCanceled(array $subscription): void
    {
        $stripeSubId = $subscription['id'] ?? null;
        if (!$stripeSubId) return;

        $pdo = Connection::get();
        $upd = $pdo->prepare("UPDATE subscriptions SET status = 'canceled', updated_at = ? WHERE stripe_subscription_id = ?");
        $upd->execute([current_timestamp(), $stripeSubId]);
    }

    private function handlePaymentFailed(array $invoice): void
    {
        $customerId = $invoice['customer'] ?? null;
        if (!$customerId) return;

        $pdo = Connection::get();
        $upd = $pdo->prepare("UPDATE subscriptions SET status = 'past_due', updated_at = ? WHERE stripe_customer_id = ?");
        $upd->execute([current_timestamp(), $customerId]);
    }

    private function verifyStripeSignature(string $payload, string $sigHeader, string $secret): bool
    {
        $parts = [];
        foreach (explode(',', $sigHeader) as $part) {
            [$key, $val] = explode('=', $part, 2) + ['', ''];
            $parts[$key] = $val;
        }

        $timestamp = (int) ($parts['t'] ?? 0);
        $v1        = $parts['v1'] ?? '';

        if (abs(time() - $timestamp) > 300) {
            return false; // Replay protection: reject >5 minutes old
        }

        $signed   = hash_hmac('sha256', "{$timestamp}.{$payload}", $secret);
        return hash_equals($signed, $v1);
    }

    public function trackUsage(string $workspaceId, string $metric, int $quantity = 1): void
    {
        try {
            $pdo    = Connection::get();
            $id     = uuid_v4();
            $period = date('Y-m');
            $now    = current_timestamp();
            $stmt   = $pdo->prepare("
                INSERT INTO usage_records (id, workspace_id, metric, quantity, period, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$id, $workspaceId, $metric, $quantity, $period, $now]);
        } catch (\Throwable) {
            // Non-critical
        }
    }
}
