<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\ContactService;
use Throwable;

final class ContactController
{
    private ContactService $service;

    public function __construct()
    {
        $this->service = new ContactService();
    }

    public function index(Request $request, Response $response): void
    {
        $wsId    = $request->workspaceId();
        $filters = [
            'search' => $request->query('search'),
            'status' => $request->query('status'),
            'source' => $request->query('source'),
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
        $contactId = $request->routeParam('id');

        try {
            $contact = $this->service->get($wsId, $contactId);
            $response->json($contact)->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 500;
            $response->error('NOT_FOUND', $e->getMessage(), $code)->send();
        }
    }

    public function store(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();

        try {
            $contact = $this->service->create($wsId, $request->all());
            $response->json($contact, 201, 'Contact created')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('CREATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function update(Request $request, Response $response): void
    {
        $wsId      = $request->workspaceId();
        $contactId = $request->routeParam('id');

        try {
            $contact = $this->service->update($wsId, $contactId, $request->all());
            $response->json($contact, 200, 'Contact updated')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('UPDATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function destroy(Request $request, Response $response): void
    {
        $wsId      = $request->workspaceId();
        $contactId = $request->routeParam('id');

        try {
            $this->service->delete($wsId, $contactId);
            $response->json(['deleted' => true], 200, 'Contact deleted')->send();
        } catch (Throwable $e) {
            $response->error('DELETE_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function importCsv(Request $request, Response $response): void
    {
        $wsId    = $request->workspaceId();
        $csv     = (string) $request->input('csv', '');
        if (empty($csv)) {
            $response->error('VALIDATION_ERROR', 'CSV content is required', 422)->send();
            return;
        }

        try {
            $result = $this->service->importCsv($wsId, $csv);
            $response->json($result, 200, "Imported {$result['created']} contacts")->send();
        } catch (Throwable $e) {
            $response->error('IMPORT_FAILED', $e->getMessage(), 400)->send();
        }
    }

    public function tags(Request $request, Response $response): void
    {
        $wsId = $request->workspaceId();
        try {
            $tags = $this->service->getTags($wsId);
            $response->json($tags)->send();
        } catch (Throwable $e) {
            $response->error('FETCH_FAILED', $e->getMessage(), 500)->send();
        }
    }

    public function storeTag(Request $request, Response $response): void
    {
        $wsId  = $request->workspaceId();
        $name  = (string) $request->input('name', '');
        $color = (string) $request->input('color', '#E11D48');

        try {
            $tag = $this->service->createTag($wsId, $name, $color);
            $response->json($tag, 201)->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('CREATE_FAILED', $e->getMessage(), $code)->send();
        }
    }
}
