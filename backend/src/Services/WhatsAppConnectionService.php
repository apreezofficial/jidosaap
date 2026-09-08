<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use App\Security\EncryptionService;
use PDO;
use RuntimeException;
use function App\Support\uuid_v4;
use function App\Support\current_timestamp;

final class WhatsAppConnectionService
{
    // Uses EncryptionService static methods directly

    public function list(string $workspaceId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT id, workspace_id, business_name, phone_number, phone_number_id, waba_id,
                webhook_verify_token, status, connected_at, last_active_at, created_at, updated_at
            FROM whatsapp_connections
            WHERE workspace_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$workspaceId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function get(string $workspaceId, string $connectionId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT id, workspace_id, business_name, phone_number, phone_number_id, waba_id,
                webhook_verify_token, status, connected_at, last_active_at, created_at, updated_at
            FROM whatsapp_connections
            WHERE id = ? AND workspace_id = ?
        ");
        $stmt->execute([$connectionId, $workspaceId]);
        $conn = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$conn) {
            throw new RuntimeException("WhatsApp connection not found", 404);
        }

        return $conn;
    }

    public function create(string $workspaceId, string $userId, array $data): array
    {
        $businessName  = trim($data['business_name'] ?? '');
        $phoneNumber   = trim($data['phone_number'] ?? '');
        $phoneNumberId = trim($data['phone_number_id'] ?? '');
        $wabaId        = trim($data['waba_id'] ?? '');
        $accessToken   = trim($data['access_token'] ?? '');

        if (empty($businessName) || empty($phoneNumber) || empty($phoneNumberId) || empty($wabaId) || empty($accessToken)) {
            throw new RuntimeException("Business name, phone number, phone number ID, WABA ID, and access token are all required", 422);
        }

        $pdo = Connection::get();

        // Check for duplicate phone_number_id in workspace
        $dup = $pdo->prepare("SELECT id FROM whatsapp_connections WHERE workspace_id = ? AND phone_number_id = ?");
        $dup->execute([$workspaceId, $phoneNumberId]);
        if ($dup->fetch()) {
            throw new RuntimeException("A connection for this phone number already exists", 409);
        }

        // Encrypt the access token before storage
        $encryptedToken     = EncryptionService::encrypt($accessToken);
        $verifyToken        = bin2hex(random_bytes(24));
        $id                 = uuid_v4();
        $now                = current_timestamp();

        $stmt = $pdo->prepare("
            INSERT INTO whatsapp_connections
                (id, workspace_id, business_name, phone_number, phone_number_id, waba_id,
                 access_token_encrypted, webhook_verify_token, status, connected_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'connected', ?, ?, ?)
        ");
        $stmt->execute([
            $id, $workspaceId, $businessName, $phoneNumber, $phoneNumberId, $wabaId,
            $encryptedToken, $verifyToken, $now, $now, $now,
        ]);

        AuditLogService::log($workspaceId, $userId, 'whatsapp_connected', 'whatsapp_connections', $id, [
            'business_name' => $businessName,
            'phone_number'  => $phoneNumber,
        ]);

        return $this->get($workspaceId, $id);
    }

    public function update(string $workspaceId, string $connectionId, array $data): array
    {
        $pdo     = Connection::get();
        $allowed = ['business_name', 'phone_number', 'status'];
        $sets    = [];
        $params  = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[]   = "{$field} = ?";
                $params[] = $data[$field];
            }
        }

        // Allow updating access token (re-encrypts)
        if (!empty($data['access_token'])) {
            $sets[]   = "access_token_encrypted = ?";
            $params[] = EncryptionService::encrypt($data['access_token']);
        }

        if (!empty($sets)) {
            $sets[]   = "updated_at = ?";
            $params[] = current_timestamp();
            $params[] = $connectionId;
            $params[] = $workspaceId;
            $sql  = "UPDATE whatsapp_connections SET " . implode(', ', $sets) . " WHERE id = ? AND workspace_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        return $this->get($workspaceId, $connectionId);
    }

    public function disconnect(string $workspaceId, string $connectionId, string $userId): void
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            UPDATE whatsapp_connections SET status = 'disconnected', updated_at = ?
            WHERE id = ? AND workspace_id = ?
        ");
        $stmt->execute([current_timestamp(), $connectionId, $workspaceId]);
        AuditLogService::log($workspaceId, $userId, 'whatsapp_disconnected', 'whatsapp_connections', $connectionId);
    }

    public function delete(string $workspaceId, string $connectionId, string $userId): void
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("DELETE FROM whatsapp_connections WHERE id = ? AND workspace_id = ?");
        $stmt->execute([$connectionId, $workspaceId]);
        AuditLogService::log($workspaceId, $userId, 'whatsapp_deleted', 'whatsapp_connections', $connectionId);
    }

    public function testConnection(string $workspaceId, string $connectionId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("SELECT * FROM whatsapp_connections WHERE id = ? AND workspace_id = ?");
        $stmt->execute([$connectionId, $workspaceId]);
        $conn = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$conn) {
            throw new RuntimeException("Connection not found", 404);
        }

        if ($conn['status'] !== 'connected') {
            return ['success' => false, 'message' => 'Connection is not in connected state'];
        }

        try {
            $accessToken = EncryptionService::decrypt($conn['access_token_encrypted']);
            $phoneId     = $conn['phone_number_id'];

            // Test by fetching phone number info from Meta
            $url = "https://graph.facebook.com/v19.0/{$phoneId}";
            $ch  = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 10,
                CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$accessToken}"],
            ]);
            $body     = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlErr  = curl_error($ch);
            curl_close($ch);

            $response = json_decode($body ?: '{}', true);
            $success  = $httpCode === 200 && !isset($response['error']);

            if ($success) {
                // Update last_active_at
                $upd = $pdo->prepare("UPDATE whatsapp_connections SET last_active_at = ?, updated_at = ? WHERE id = ?");
                $upd->execute([current_timestamp(), current_timestamp(), $connectionId]);
            }

            return [
                'success'   => $success,
                'http_code' => $httpCode,
                'message'   => $success ? 'Connection verified with Meta API' : ($response['error']['message'] ?? 'API test failed'),
                'curl_error' => $curlErr ?: null,
            ];
        } catch (\Throwable $e) {
            return ['success' => false, 'message' => 'Failed to decrypt credentials or connect to Meta API'];
        }
    }

    /**
     * Get decrypted access token for internal use (never expose to frontend)
     */
    public function getDecryptedToken(string $connectionId): string
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("SELECT access_token_encrypted FROM whatsapp_connections WHERE id = ?");
        $stmt->execute([$connectionId]);
        $row  = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            throw new RuntimeException("Connection not found", 404);
        }

        return EncryptionService::decrypt($row['access_token_encrypted']) ?? '';
    }

    public function getConnectionByPhoneNumberId(string $phoneNumberId): ?array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT id, workspace_id, business_name, phone_number, phone_number_id, waba_id,
                webhook_verify_token, status, connected_at, last_active_at
            FROM whatsapp_connections
            WHERE phone_number_id = ? AND status = 'connected'
            LIMIT 1
        ");
        $stmt->execute([$phoneNumberId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}
