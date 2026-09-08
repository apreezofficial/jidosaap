<?php

declare(strict_types=1);

namespace App\Providers\WhatsApp;

use RuntimeException;

/**
 * Official Meta WhatsApp Business Cloud API provider.
 *
 * This is the ONLY approved WhatsApp integration in JidoSapp.
 * It uses the official Meta API only — no web scraping, no QR sessions,
 * no unofficial libraries.
 */
final class MetaWhatsAppProvider implements WhatsAppProviderInterface
{
    private const API_VERSION = 'v19.0';
    private const BASE_URL    = 'https://graph.facebook.com';

    public function __construct(
        private readonly string $accessToken,
        private readonly string $phoneNumberId,
        private readonly string $appSecret,
    ) {}

    public function sendTextMessage(string $recipient, string $message): WhatsAppResult
    {
        $payload = [
            'messaging_product' => 'whatsapp',
            'recipient_type'    => 'individual',
            'to'                => $this->normalizePhone($recipient),
            'type'              => 'text',
            'text'              => ['preview_url' => false, 'body' => $message],
        ];

        return $this->callApi('POST', "/{$this->phoneNumberId}/messages", $payload);
    }

    public function sendMediaMessage(
        string $recipient,
        string $mediaUrl,
        string $mediaType = 'image',
        ?string $caption = null
    ): WhatsAppResult {
        $supportedTypes = ['image', 'video', 'document', 'audio'];
        if (!in_array($mediaType, $supportedTypes, true)) {
            return WhatsAppResult::failure('UNSUPPORTED_MEDIA_TYPE', "Media type '{$mediaType}' is not supported by the WhatsApp API");
        }

        $mediaPayload = ['link' => $mediaUrl];
        if ($caption !== null && in_array($mediaType, ['image', 'video', 'document'], true)) {
            $mediaPayload['caption'] = $caption;
        }

        $payload = [
            'messaging_product' => 'whatsapp',
            'recipient_type'    => 'individual',
            'to'                => $this->normalizePhone($recipient),
            'type'              => $mediaType,
            $mediaType          => $mediaPayload,
        ];

        return $this->callApi('POST', "/{$this->phoneNumberId}/messages", $payload);
    }

    public function sendTemplateMessage(
        string $recipient,
        string $templateName,
        string $languageCode,
        array $components = []
    ): WhatsAppResult {
        $payload = [
            'messaging_product' => 'whatsapp',
            'to'                => $this->normalizePhone($recipient),
            'type'              => 'template',
            'template'          => [
                'name'       => $templateName,
                'language'   => ['code' => $languageCode],
                'components' => $components,
            ],
        ];

        return $this->callApi('POST', "/{$this->phoneNumberId}/messages", $payload);
    }

    public function markAsRead(string $messageId): WhatsAppResult
    {
        $payload = [
            'messaging_product' => 'whatsapp',
            'status'            => 'read',
            'message_id'        => $messageId,
        ];

        return $this->callApi('POST', "/{$this->phoneNumberId}/messages", $payload);
    }

    public function verifyWebhookSignature(string $signature, string $payload): bool
    {
        if (!str_starts_with($signature, 'sha256=')) {
            return false;
        }

        $expected = 'sha256=' . hash_hmac('sha256', $payload, $this->appSecret);
        return hash_equals($expected, $signature);
    }

    public function parseWebhookPayload(array $payload): array
    {
        $events = [];

        $entry = $payload['entry'] ?? [];
        foreach ($entry as $e) {
            $changes = $e['changes'] ?? [];
            foreach ($changes as $change) {
                $value = $change['value'] ?? [];
                $field = $change['field'] ?? '';

                if ($field !== 'messages') {
                    continue;
                }

                // Incoming messages
                foreach ($value['messages'] ?? [] as $msg) {
                    $events[] = [
                        'type'           => 'message',
                        'phone_number_id' => $value['metadata']['phone_number_id'] ?? null,
                        'from'           => $msg['from'] ?? null,
                        'message_id'     => $msg['id'] ?? null,
                        'timestamp'      => $msg['timestamp'] ?? null,
                        'message_type'   => $msg['type'] ?? 'text',
                        'text'           => $msg['text']['body'] ?? null,
                        'media'          => $this->extractMedia($msg),
                        'context'        => $msg['context'] ?? null,
                        'contacts'       => $value['contacts'] ?? [],
                    ];
                }

                // Status updates (delivery, read receipts)
                foreach ($value['statuses'] ?? [] as $status) {
                    $events[] = [
                        'type'       => 'status',
                        'message_id' => $status['id'] ?? null,
                        'status'     => $status['status'] ?? null,
                        'timestamp'  => $status['timestamp'] ?? null,
                        'recipient'  => $status['recipient_id'] ?? null,
                        'errors'     => $status['errors'] ?? [],
                    ];
                }
            }
        }

        return $events;
    }

    private function extractMedia(array $msg): ?array
    {
        $type = $msg['type'] ?? 'text';
        if ($type === 'text') return null;

        return match ($type) {
            'image'    => $msg['image'] ?? null,
            'video'    => $msg['video'] ?? null,
            'audio'    => $msg['audio'] ?? null,
            'document' => $msg['document'] ?? null,
            'sticker'  => $msg['sticker'] ?? null,
            'location' => $msg['location'] ?? null,
            default    => null,
        };
    }

    private function callApi(string $method, string $endpoint, array $payload): WhatsAppResult
    {
        $url = self::BASE_URL . '/' . self::API_VERSION . $endpoint;

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_HTTPHEADER     => [
                'Authorization: Bearer ' . $this->accessToken,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_TIMEOUT        => 15,
        ]);

        $body      = curl_exec($ch);
        $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            return WhatsAppResult::failure('CURL_ERROR', $curlError);
        }

        $response = json_decode($body ?: '{}', true);

        if ($httpCode >= 200 && $httpCode < 300 && !isset($response['error'])) {
            $messageId = $response['messages'][0]['id'] ?? $response['message_id'] ?? null;
            return WhatsAppResult::success($messageId ?? '', $response);
        }

        $error    = $response['error'] ?? [];
        $errCode  = (string) ($error['code'] ?? $httpCode);
        $errMsg   = $error['message'] ?? "API request failed with HTTP {$httpCode}";

        return WhatsAppResult::failure($errCode, $errMsg, $response);
    }

    private function normalizePhone(string $phone): string
    {
        // Strip non-numeric characters except leading +
        $normalized = preg_replace('/[^0-9]/', '', $phone);
        return $normalized ?: $phone;
    }
}
