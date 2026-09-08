<?php

declare(strict_types=1);

use App\Controllers\AgentController;
use App\Controllers\AnalyticsController;
use App\Controllers\AuthController;
use App\Controllers\AutomationController;
use App\Controllers\BillingController;
use App\Controllers\ContactController;
use App\Controllers\ContentController;
use App\Controllers\ConversationController;
use App\Controllers\CrmController;
use App\Controllers\WhatsAppController;
use App\Controllers\WorkspaceController;
use App\Middleware\AuthMiddleware;
use App\Middleware\TenantMiddleware;
use App\Middleware\RateLimitMiddleware;
use App\Routing\Router;

/** @var Router $router */

$router->group('/api/v1', [], function (Router $api) {

    // ──────────────────────────────────────────────
    // Health check
    // ──────────────────────────────────────────────
    $api->get('/health', function ($req, $res) {
        $res->json([
            'status'    => 'ok',
            'app'       => 'JidoSapp API',
            'version'   => '1.0.0',
            'timestamp' => \App\Support\current_timestamp(),
        ])->send();
    });

    // ──────────────────────────────────────────────
    // Public: Billing plans (no auth required)
    // ──────────────────────────────────────────────
    $api->get('/plans', [BillingController::class, 'plans']);

    // ──────────────────────────────────────────────
    // Authentication (Rate limited)
    // ──────────────────────────────────────────────
    $authRateLimiter = new RateLimitMiddleware(20, 60, 'auth');
    $api->group('/auth', [$authRateLimiter], function (Router $auth) {
        $auth->post('/register',        [AuthController::class, 'register']);
        $auth->post('/login',           [AuthController::class, 'login']);
        $auth->post('/forgot-password', [AuthController::class, 'forgotPassword']);
        $auth->post('/reset-password',  [AuthController::class, 'resetPassword']);
    });

    // Authenticated user routes
    $api->group('/auth', [AuthMiddleware::class], function (Router $auth) {
        $auth->get('/me',              [AuthController::class, 'me']);
        $auth->post('/logout',         [AuthController::class, 'logout']);
        $auth->patch('/profile',       [AuthController::class, 'updateProfile']);
        $auth->post('/change-password',[AuthController::class, 'changePassword']);
    });

    // ──────────────────────────────────────────────
    // Workspaces (user-level, auth only)
    // ──────────────────────────────────────────────
    $api->group('/workspaces', [AuthMiddleware::class], function (Router $ws) {
        $ws->get('',  [WorkspaceController::class, 'index']);
        $ws->post('', [WorkspaceController::class, 'store']);
    });

    // ──────────────────────────────────────────────
    // Tenant-scoped routes (auth + workspace isolation)
    // ──────────────────────────────────────────────
    $tenantStack = [AuthMiddleware::class, TenantMiddleware::class];

    // Current workspace management
    $api->group('/workspace', $tenantStack, function (Router $ws) {
        $ws->get('',               [WorkspaceController::class, 'show']);
        $ws->patch('',             [WorkspaceController::class, 'update']);
        $ws->delete('',            [WorkspaceController::class, 'destroy']);
        $ws->get('/members',       [WorkspaceController::class, 'members']);
        $ws->post('/members',      [WorkspaceController::class, 'invite']);
        $ws->patch('/members/:id', [WorkspaceController::class, 'updateMember']);
        $ws->delete('/members/:id', [WorkspaceController::class, 'removeMember']);
    });

    // ──────────────────────────────────────────────
    // Contacts
    // ──────────────────────────────────────────────
    $api->group('/contacts', $tenantStack, function (Router $r) {
        $r->get('',             [ContactController::class, 'index']);
        $r->post('',            [ContactController::class, 'store']);
        $r->post('/import',     [ContactController::class, 'importCsv']);
        $r->get('/tags',        [ContactController::class, 'tags']);
        $r->post('/tags',       [ContactController::class, 'storeTag']);
        $r->get('/:id',         [ContactController::class, 'show']);
        $r->patch('/:id',       [ContactController::class, 'update']);
        $r->delete('/:id',      [ContactController::class, 'destroy']);
    });

    // ──────────────────────────────────────────────
    // Inbox / Conversations & Messages
    // ──────────────────────────────────────────────
    $api->group('/conversations', $tenantStack, function (Router $r) {
        $r->get('',                        [ConversationController::class, 'index']);
        $r->get('/:id',                    [ConversationController::class, 'show']);
        $r->get('/:id/messages',           [ConversationController::class, 'messages']);
        $r->post('/:id/messages',          [ConversationController::class, 'sendMessage']);
        $r->post('/:id/notes',             [ConversationController::class, 'addNote']);
        $r->patch('/:id/status',           [ConversationController::class, 'updateStatus']);
        $r->post('/:id/handoff',           [ConversationController::class, 'handoff']);
        $r->post('/:id/assign',            [ConversationController::class, 'assign']);
    });

    // ──────────────────────────────────────────────
    // Content Studio
    // ──────────────────────────────────────────────
    $api->group('/content', $tenantStack, function (Router $r) {
        $r->get('',                [ContentController::class, 'index']);
        $r->post('',               [ContentController::class, 'store']);
        $r->get('/calendar',       [ContentController::class, 'calendar']);
        $r->get('/templates',      [ContentController::class, 'templates']);
        $r->post('/templates',     [ContentController::class, 'storeTemplate']);
        $r->get('/:id',            [ContentController::class, 'show']);
        $r->patch('/:id',          [ContentController::class, 'update']);
        $r->delete('/:id',         [ContentController::class, 'destroy']);
        $r->post('/:id/schedule',  [ContentController::class, 'schedule']);
    });

    // Scheduled posts
    $api->group('/scheduled-posts', $tenantStack, function (Router $r) {
        $r->delete('/:id', [ContentController::class, 'cancelSchedule']);
    });

    // ──────────────────────────────────────────────
    // Automations
    // ──────────────────────────────────────────────
    $api->group('/automations', $tenantStack, function (Router $r) {
        $r->get('',              [AutomationController::class, 'index']);
        $r->post('',             [AutomationController::class, 'store']);
        $r->get('/:id',          [AutomationController::class, 'show']);
        $r->patch('/:id',        [AutomationController::class, 'update']);
        $r->delete('/:id',       [AutomationController::class, 'destroy']);
        $r->post('/:id/enable',  [AutomationController::class, 'enable']);
        $r->post('/:id/disable', [AutomationController::class, 'disable']);
        $r->get('/:id/runs',     [AutomationController::class, 'runs']);
    });

    // ──────────────────────────────────────────────
    // API Integrations / Connections
    // ──────────────────────────────────────────────
    $api->group('/integrations/api', $tenantStack, function (Router $r) {
        $r->get('',             [AutomationController::class, 'apiConnections']);
        $r->post('',            [AutomationController::class, 'storeApiConnection']);
        $r->post('/:id/test',   [AutomationController::class, 'testApiConnection']);
    });

    // ──────────────────────────────────────────────
    // WhatsApp Connections
    // ──────────────────────────────────────────────
    $api->group('/integrations/whatsapp', $tenantStack, function (Router $r) {
        $r->get('',                   [WhatsAppController::class, 'index']);
        $r->post('',                  [WhatsAppController::class, 'store']);
        $r->get('/:id',               [WhatsAppController::class, 'show']);
        $r->patch('/:id',             [WhatsAppController::class, 'update']);
        $r->post('/:id/disconnect',   [WhatsAppController::class, 'disconnect']);
        $r->delete('/:id',            [WhatsAppController::class, 'destroy']);
        $r->post('/:id/test',         [WhatsAppController::class, 'test']);
    });

    // ──────────────────────────────────────────────
    // AI Agents
    // ──────────────────────────────────────────────
    $api->group('/agents', $tenantStack, function (Router $r) {
        $r->get('',   [AgentController::class, 'index']);
        $r->post('',  [AgentController::class, 'store']);
        $r->get('/:id',    [AgentController::class, 'show']);
        $r->patch('/:id',  [AgentController::class, 'update']);
        $r->delete('/:id', [AgentController::class, 'destroy']);
    });

    // ──────────────────────────────────────────────
    // Knowledge Base
    // ──────────────────────────────────────────────
    $api->group('/knowledge-bases', $tenantStack, function (Router $r) {
        $r->get('',   [AgentController::class, 'knowledgeBases']);
        $r->post('',  [AgentController::class, 'storeKnowledgeBase']);
        $r->get('/:kbId/documents',  [AgentController::class, 'documents']);
        $r->post('/:kbId/documents', [AgentController::class, 'storeDocument']);
    });

    // ──────────────────────────────────────────────
    // CRM
    // ──────────────────────────────────────────────
    $api->group('/crm', $tenantStack, function (Router $r) {
        $r->get('/leads',                   [CrmController::class, 'leads']);
        $r->post('/leads',                  [CrmController::class, 'storeLead']);
        $r->get('/pipeline',                [CrmController::class, 'pipelineBoard']);
        $r->get('/leads/:id',               [CrmController::class, 'getLead']);
        $r->patch('/leads/:id',             [CrmController::class, 'updateLead']);
        $r->delete('/leads/:id',            [CrmController::class, 'deleteLead']);
        $r->post('/leads/:id/notes',        [CrmController::class, 'addLeadNote']);
    });

    // ──────────────────────────────────────────────
    // Analytics
    // ──────────────────────────────────────────────
    $api->group('/analytics', $tenantStack, function (Router $r) {
        $r->get('/dashboard',   [AnalyticsController::class, 'dashboard']);
        $r->get('/messages',    [AnalyticsController::class, 'messages']);
        $r->get('/leads',       [AnalyticsController::class, 'leads']);
        $r->get('/automations', [AnalyticsController::class, 'automations']);
        $r->get('/activity',    [AnalyticsController::class, 'activity']);
        $r->get('/usage',       [AnalyticsController::class, 'usage']);
    });

    // ──────────────────────────────────────────────
    // Billing
    // ──────────────────────────────────────────────
    $api->group('/billing', $tenantStack, function (Router $r) {
        $r->get('/subscription', [BillingController::class, 'subscription']);
        $r->get('/usage',        [BillingController::class, 'usage']);
        $r->post('/checkout',    [BillingController::class, 'createCheckout']);
        $r->post('/portal',      [BillingController::class, 'createPortal']);
    });

    // Stripe webhook — no auth, signature-verified
    $api->post('/billing/webhook/stripe', [BillingController::class, 'stripeWebhook']);

    // ──────────────────────────────────────────────
    // Notifications
    // ──────────────────────────────────────────────
    $api->group('/notifications', $tenantStack, function (Router $r) {
        $r->get('',         [\App\Controllers\NotificationController::class, 'index']);
        $r->post('/read',   [\App\Controllers\NotificationController::class, 'markRead']);
        $r->post('/:id/read', [\App\Controllers\NotificationController::class, 'markRead']);
    });

    // ──────────────────────────────────────────────
    // AI Content Generation
    // ──────────────────────────────────────────────
    $api->group('/ai', $tenantStack, function (Router $r) {
        $r->post('/generate',        [\App\Controllers\AiController::class, 'generate']);
        $r->post('/rewrite',         [\App\Controllers\AiController::class, 'rewrite']);
        $r->post('/classify-intent', [\App\Controllers\AiController::class, 'classifyIntent']);
    });
});
