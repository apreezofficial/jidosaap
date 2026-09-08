<?php

declare(strict_types=1);

namespace App\Providers\WhatsApp;

interface WhatsAppProviderInterface
{
    /**
     * Send a plain text message via WhatsApp.
     */
    public function sendTextMessage(
        string $recipient,
        string $message
    ): WhatsAppResult;

    /**
     * Send a media message (image, video, document) via WhatsApp.
     */
    public function sendMediaMessage(
        string $recipient,
        string $mediaUrl,
        string $mediaType = 'image',
        ?string $caption = null
    ): WhatsAppResult;

    /**
     * Send a pre-approved template message via WhatsApp.
     */
    public function sendTemplateMessage(
        string $recipient,
        string $templateName,
        string $languageCode,
        array  $components = []
    ): WhatsAppResult;

    /**
     * Mark an incoming message as read.
     */
    public function markAsRead(string $messageId): WhatsAppResult;

    /**
     * Verify a Meta webhook signature.
     *
     * @param string $signature The X-Hub-Signature-256 header value
     * @param string $payload   The raw POST body
     */
    public function verifyWebhookSignature(string $signature, string $payload): bool;

    /**
     * Parse and normalize an incoming webhook payload.
     *
     * Returns an array of normalized event objects.
     */
    public function parseWebhookPayload(array $payload): array;
}
