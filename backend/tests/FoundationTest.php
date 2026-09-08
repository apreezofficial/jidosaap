<?php

declare(strict_types=1);

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\Security\PasswordHasher;
use App\Security\EncryptionService;
use App\Security\TokenService;
use App\Services\AuthService;
use App\Services\WorkspaceService;
use App\Services\PermissionService;
use App\Database\MigrationManager;
use Dotenv\Dotenv;

final class FoundationTest extends TestCase
{
    public static function setUpBeforeClass(): void
    {
        if (file_exists(dirname(__DIR__) . '/.env')) {
            $dotenv = Dotenv::createImmutable(dirname(__DIR__));
            $dotenv->safeLoad();
        }
        $migrator = new MigrationManager();
        $migrator->run();
    }

    public function testPasswordHasher(): void
    {
        $password = "JidoSapp@Sec2026";
        $hash = PasswordHasher::hash($password);

        $this->assertNotEmpty($hash);
        $this->assertTrue(PasswordHasher::verify($password, $hash));
        $this->assertFalse(PasswordHasher::verify("WrongPassword", $hash));
    }

    public function testEncryptionService(): void
    {
        $secret = "meta_access_token_EAABwz...";
        $encrypted = EncryptionService::encrypt($secret);

        $this->assertNotEquals($secret, $encrypted);
        $decrypted = EncryptionService::decrypt($encrypted);
        $this->assertEquals($secret, $decrypted);
    }

    public function testTokenService(): void
    {
        $payload = ['sub' => 'user-123-uuid', 'email' => 'test@example.com'];
        $token = TokenService::createToken($payload, 3600);

        $this->assertNotEmpty($token);
        $verified = TokenService::verifyToken($token);
        $this->assertNotNull($verified);
        $this->assertEquals('user-123-uuid', $verified['sub']);
        $this->assertEquals('test@example.com', $verified['email']);
    }

    public function testPermissions(): void
    {
        $this->assertTrue(PermissionService::can('owner', PermissionService::PERM_WORKSPACE_DELETE));
        $this->assertFalse(PermissionService::can('member', PermissionService::PERM_WORKSPACE_DELETE));
        $this->assertTrue(PermissionService::can('member', PermissionService::PERM_CONTENT_CREATE));
        $this->assertFalse(PermissionService::can('viewer', PermissionService::PERM_CONTENT_CREATE));
    }

    public function testAuthAndMultiTenancyFlow(): void
    {
        $auth = new AuthService();
        $ws = new WorkspaceService();

        $randomSuffix = bin2hex(random_bytes(4));
        $email = "test_{$randomSuffix}@jidosapp.io";

        // Register
        $res = $auth->register("Jido Founder", $email, "StrongSecretPass123!", "Jido Tech Org");
        $this->assertArrayHasKey('user', $res);
        $this->assertArrayHasKey('token', $res);
        $this->assertArrayHasKey('workspace', $res);
        $this->assertEquals('owner', $res['workspace']['role']);

        // Login
        $loginRes = $auth->login($email, "StrongSecretPass123!");
        $this->assertEquals($res['user']['id'], $loginRes['user']['id']);
        $this->assertCount(1, $loginRes['workspaces']);

        // Workspace member listing
        $members = $ws->getMembers($res['workspace']['id']);
        $this->assertCount(1, $members);
        $this->assertEquals($res['user']['id'], $members[0]['user_id']);
    }
}
