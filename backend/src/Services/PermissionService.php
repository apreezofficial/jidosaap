<?php

declare(strict_types=1);

namespace App\Services;

final class PermissionService
{
    public const ROLE_OWNER  = 'owner';
    public const ROLE_ADMIN  = 'admin';
    public const ROLE_MEMBER = 'member';
    public const ROLE_VIEWER = 'viewer';

    public const PERM_WORKSPACE_DELETE    = 'workspace.delete';
    public const PERM_BILLING_MANAGE      = 'billing.manage';
    public const PERM_USERS_MANAGE        = 'users.manage';
    public const PERM_INTEGRATIONS_MANAGE = 'integrations.manage';
    public const PERM_AUTOMATIONS_MANAGE  = 'automations.manage';
    public const PERM_CONTENT_MANAGE      = 'content.manage';
    public const PERM_CONTENT_CREATE      = 'content.create';
    public const PERM_INBOX_MANAGE        = 'inbox.manage';
    public const PERM_CONTACTS_MANAGE     = 'contacts.manage';
    public const PERM_READ_ONLY           = 'read.only';

    /**
     * Map of roles to allowed permissions.
     */
    private const ROLE_PERMISSIONS = [
        self::ROLE_OWNER => [
            self::PERM_WORKSPACE_DELETE,
            self::PERM_BILLING_MANAGE,
            self::PERM_USERS_MANAGE,
            self::PERM_INTEGRATIONS_MANAGE,
            self::PERM_AUTOMATIONS_MANAGE,
            self::PERM_CONTENT_MANAGE,
            self::PERM_CONTENT_CREATE,
            self::PERM_INBOX_MANAGE,
            self::PERM_CONTACTS_MANAGE,
            self::PERM_READ_ONLY,
        ],
        self::ROLE_ADMIN => [
            self::PERM_USERS_MANAGE,
            self::PERM_INTEGRATIONS_MANAGE,
            self::PERM_AUTOMATIONS_MANAGE,
            self::PERM_CONTENT_MANAGE,
            self::PERM_CONTENT_CREATE,
            self::PERM_INBOX_MANAGE,
            self::PERM_CONTACTS_MANAGE,
            self::PERM_READ_ONLY,
        ],
        self::ROLE_MEMBER => [
            self::PERM_CONTENT_CREATE,
            self::PERM_INBOX_MANAGE,
            self::PERM_CONTACTS_MANAGE,
            self::PERM_READ_ONLY,
        ],
        self::ROLE_VIEWER => [
            self::PERM_READ_ONLY,
        ],
    ];

    /**
     * Determine if a role has the specified permission.
     */
    public static function can(string $role, string $permission): bool
    {
        $perms = self::ROLE_PERMISSIONS[$role] ?? [];
        return in_array($permission, $perms, true);
    }

    /**
     * Assert permission or throw authorization exception.
     */
    public static function authorize(string $role, string $permission): void
    {
        if (!self::can($role, $permission)) {
            throw new \RuntimeException("Unauthorized: Insufficient permissions for action [{$permission}] with role [{$role}]", 403);
        }
    }
}
