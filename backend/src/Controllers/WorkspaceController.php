<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\WorkspaceService;
use App\Services\PermissionService;
use Throwable;

final class WorkspaceController
{
    private WorkspaceService $service;

    public function __construct()
    {
        $this->service = new WorkspaceService();
    }

    public function index(Request $request, Response $response): void
    {
        $userId = (string) $request->userId();
        $workspaces = $this->service->listForUser($userId);
        $response->json($workspaces)->send();
    }

    public function store(Request $request, Response $response): void
    {
        $userId = (string) $request->userId();
        $name = (string) $request->input('name', '');
        $timezone = (string) $request->input('timezone', 'UTC');
        $businessType = (string) $request->input('business_type', 'services');

        if (empty($name)) {
            $response->error('VALIDATION_ERROR', 'Workspace name is required', 422)->send();
            return;
        }

        try {
            $ws = $this->service->create($userId, $name, $timezone, $businessType);
            $response->json($ws, 201, 'Workspace created successfully')->send();
        } catch (Throwable $e) {
            $response->error('CREATION_FAILED', $e->getMessage(), 400)->send();
        }
    }

    public function show(Request $request, Response $response): void
    {
        $workspace = $request->workspace();
        $response->json($workspace)->send();
    }

    public function update(Request $request, Response $response): void
    {
        PermissionService::authorize($request->role() ?? '', PermissionService::PERM_WORKSPACE_DELETE); // or admin
        $wsId = (string) $request->workspaceId();
        $data = $request->all();

        try {
            $updated = $this->service->update($wsId, $data);
            $response->json($updated, 200, 'Workspace settings updated')->send();
        } catch (Throwable $e) {
            $response->error('UPDATE_FAILED', $e->getMessage(), 400)->send();
        }
    }

    public function members(Request $request, Response $response): void
    {
        $wsId = (string) $request->workspaceId();
        $members = $this->service->getMembers($wsId);
        $response->json($members)->send();
    }

    public function invite(Request $request, Response $response): void
    {
        PermissionService::authorize($request->role() ?? '', PermissionService::PERM_USERS_MANAGE);
        $wsId = (string) $request->workspaceId();
        $email = (string) $request->input('email', '');
        $role = (string) $request->input('role', 'member');

        if (empty($email)) {
            $response->error('VALIDATION_ERROR', 'Email is required', 422)->send();
            return;
        }

        try {
            $invited = $this->service->inviteMember($wsId, $email, $role);
            $response->json($invited, 201, 'Team member added')->send();
        } catch (Throwable $e) {
            $response->error('INVITE_FAILED', $e->getMessage(), 400)->send();
        }
    }

    public function updateMember(Request $request, Response $response): void
    {
        PermissionService::authorize($request->role() ?? '', PermissionService::PERM_USERS_MANAGE);
        $wsId = (string) $request->workspaceId();
        $targetUserId = (string) $request->param('id', '');
        $role = (string) $request->input('role', 'member');

        try {
            $this->service->updateMemberRole($wsId, $targetUserId, $role);
            $response->json(['updated' => true], 200, 'Member role updated')->send();
        } catch (Throwable $e) {
            $response->error('UPDATE_FAILED', $e->getMessage(), 400)->send();
        }
    }

    public function removeMember(Request $request, Response $response): void
    {
        PermissionService::authorize($request->role() ?? '', PermissionService::PERM_USERS_MANAGE);
        $wsId = (string) $request->workspaceId();
        $targetUserId = (string) $request->param('id', '');

        try {
            $this->service->removeMember($wsId, $targetUserId);
            $response->json(['removed' => true], 200, 'Member removed from workspace')->send();
        } catch (Throwable $e) {
            $response->error('REMOVAL_FAILED', $e->getMessage(), 400)->send();
        }
    }

    public function destroy(Request $request, Response $response): void
    {
        PermissionService::authorize($request->role() ?? '', PermissionService::PERM_WORKSPACE_DELETE);
        $wsId = (string) $request->workspaceId();

        try {
            $this->service->delete($wsId);
            $response->json(['deleted' => true], 200, 'Workspace deleted successfully')->send();
        } catch (Throwable $e) {
            $response->error('DELETE_FAILED', $e->getMessage(), 400)->send();
        }
    }
}
