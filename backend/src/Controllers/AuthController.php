<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\AuthService;
use Throwable;

final class AuthController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function register(Request $request, Response $response): void
    {
        $name = (string) $request->input('name', '');
        $email = (string) $request->input('email', '');
        $password = (string) $request->input('password', '');
        $workspaceName = $request->input('workspace_name');

        if (empty($name) || empty($email) || empty($password)) {
            $response->error('VALIDATION_ERROR', 'Name, email and password are required', 422, [
                'name' => empty($name) ? 'Name is required' : null,
                'email' => empty($email) ? 'Email is required' : null,
                'password' => empty($password) ? 'Password is required' : null,
            ])->send();
            return;
        }

        try {
            $result = $this->authService->register($name, $email, $password, $workspaceName);
            $response->json($result, 201, 'Registration successful')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('REGISTRATION_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function login(Request $request, Response $response): void
    {
        $email = (string) $request->input('email', '');
        $password = (string) $request->input('password', '');

        if (empty($email) || empty($password)) {
            $response->error('VALIDATION_ERROR', 'Email and password are required', 422)->send();
            return;
        }

        try {
            $result = $this->authService->login($email, $password);
            $response->json($result, 200, 'Login successful')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 401;
            $response->error('AUTH_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function me(Request $request, Response $response): void
    {
        $userId = $request->userId();
        if (!$userId) {
            $response->error('UNAUTHORIZED', 'Not authenticated', 401)->send();
            return;
        }

        try {
            $result = $this->authService->me($userId);
            $response->json($result)->send();
        } catch (Throwable $e) {
            $response->error('NOT_FOUND', $e->getMessage(), 404)->send();
        }
    }

    public function logout(Request $request, Response $response): void
    {
        $userId = $request->userId() ?? '';
        $authHeader = $request->header('authorization');
        $token = $authHeader && str_starts_with($authHeader, 'Bearer ') ? substr($authHeader, 7) : null;

        $this->authService->logout($userId, $token);
        $response->json(['logged_out' => true], 200, 'Logged out successfully')->send();
    }

    public function forgotPassword(Request $request, Response $response): void
    {
        $email = (string) $request->input('email', '');
        if (empty($email)) {
            $response->error('VALIDATION_ERROR', 'Email is required', 422)->send();
            return;
        }

        $resetToken = $this->authService->forgotPassword($email);
        $response->json([
            'message'     => 'If an account exists with this email, a password reset link has been dispatched.',
            'reset_token' => $resetToken, // Returned in dev/API for simple testing
        ])->send();
    }

    public function resetPassword(Request $request, Response $response): void
    {
        $token = (string) $request->input('token', '');
        $password = (string) $request->input('password', '');

        if (empty($token) || empty($password)) {
            $response->error('VALIDATION_ERROR', 'Reset token and new password are required', 422)->send();
            return;
        }

        try {
            $this->authService->resetPassword($token, $password);
            $response->json(['reset' => true], 200, 'Password has been successfully updated')->send();
        } catch (Throwable $e) {
            $response->error('RESET_FAILED', $e->getMessage(), 400)->send();
        }
    }

    public function updateProfile(Request $request, Response $response): void
    {
        $userId = $request->userId() ?? '';
        $name   = (string) $request->input('name', '');
        $email  = (string) $request->input('email', '');

        try {
            $user = $this->authService->updateProfile($userId, $name, $email);
            $response->json($user, 200, 'Profile updated')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('UPDATE_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function changePassword(Request $request, Response $response): void
    {
        $userId          = $request->userId() ?? '';
        $currentPassword = (string) $request->input('current_password', '');
        $newPassword     = (string) $request->input('new_password', '');

        if (empty($currentPassword) || empty($newPassword)) {
            $response->error('VALIDATION_ERROR', 'Current and new password are required', 422)->send();
            return;
        }

        try {
            $this->authService->changePassword($userId, $currentPassword, $newPassword);
            $response->json(['changed' => true], 200, 'Password changed successfully')->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 400;
            $response->error('CHANGE_FAILED', $e->getMessage(), $code)->send();
        }
    }
}
