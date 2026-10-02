<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\SetupService;
use Throwable;

final class SetupController
{
    private SetupService $service;

    public function __construct()
    {
        $this->service = new SetupService();
    }

    /** GET /api/v1/setup/status — check if app is configured */
    public function status(Request $request, Response $response): void
    {
        $response->json($this->service->getStatus())->send();
    }

    /** POST /api/v1/setup/test-db — test database connection */
    public function testDb(Request $request, Response $response): void
    {
        $data = $request->all();
        try {
            $result = $this->service->testDatabase(
                (string)($data['host']     ?? '127.0.0.1'),
                (int)   ($data['port']     ?? 5432),
                (string)($data['database'] ?? 'jidosapp'),
                (string)($data['username'] ?? 'postgres'),
                (string)($data['password'] ?? '')
            );
            $response->json($result)->send();
        } catch (Throwable $e) {
            $response->json(['success' => false, 'error' => $e->getMessage()])->send();
        }
    }

    /** POST /api/v1/setup/test-redis — test Redis connection */
    public function testRedis(Request $request, Response $response): void
    {
        $data = $request->all();
        try {
            $result = $this->service->testRedis(
                (string)($data['host'] ?? '127.0.0.1'),
                (int)   ($data['port'] ?? 6379)
            );
            $response->json($result)->send();
        } catch (Throwable $e) {
            $response->json(['success' => false, 'error' => $e->getMessage()])->send();
        }
    }

    /** POST /api/v1/setup/test-openai — test OpenAI key */
    public function testOpenAi(Request $request, Response $response): void
    {
        $key = (string)($request->input('api_key') ?? '');
        if (empty($key)) {
            $response->json(['success' => false, 'error' => 'API key required'])->send();
            return;
        }
        $response->json($this->service->testOpenAi($key))->send();
    }

    /** POST /api/v1/setup/test-whatsapp — test Meta WhatsApp token */
    public function testWhatsApp(Request $request, Response $response): void
    {
        $token         = (string)($request->input('access_token')   ?? '');
        $phoneNumberId = (string)($request->input('phone_number_id') ?? '');
        if (empty($token) || empty($phoneNumberId)) {
            $response->json(['success' => false, 'error' => 'access_token and phone_number_id required'])->send();
            return;
        }
        $response->json($this->service->testWhatsApp($token, $phoneNumberId))->send();
    }

    /** POST /api/v1/setup/save — persist full config and run migrations */
    public function save(Request $request, Response $response): void
    {
        // Only allow if not yet configured
        if ($this->service->isConfigured()) {
            $response->error('ALREADY_CONFIGURED', 'App is already configured. Edit .env directly.', 403)->send();
            return;
        }

        try {
            $result = $this->service->saveConfiguration($request->all());
            $response->json($result, 200, 'Configuration saved successfully')->send();
        } catch (Throwable $e) {
            $response->error('SETUP_FAILED', $e->getMessage(), 500)->send();
        }
    }

    /** POST /api/v1/setup/create-admin — create first admin account */
    public function createAdmin(Request $request, Response $response): void
    {
        if ($this->service->hasAdminAccount()) {
            $response->error('ADMIN_EXISTS', 'An admin account already exists. Please log in.', 409)->send();
            return;
        }

        try {
            $data   = $request->all();
            $result = $this->service->createAdminAccount(
                (string)($data['name']           ?? ''),
                (string)($data['email']          ?? ''),
                (string)($data['password']       ?? ''),
                (string)($data['workspace_name'] ?? 'My Business')
            );
            $response->json($result, 201, 'Admin account created')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int)$e->getCode() : 400;
            $response->error('CREATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    /** POST /api/v1/setup/migrate — run database migrations */
    public function migrate(Request $request, Response $response): void
    {
        try {
            $result = $this->service->runMigrations();
            $response->json($result, 200, 'Migrations completed')->send();
        } catch (Throwable $e) {
            $response->error('MIGRATION_FAILED', $e->getMessage(), 500)->send();
        }
    }
}
