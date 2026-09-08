<?php

declare(strict_types=1);

namespace App\Providers\WhatsApp;

final class WhatsAppResult
{
    public function __construct(
        public readonly bool   $success,
        public readonly ?string $messageId = null,
        public readonly ?string $errorCode = null,
        public readonly ?string $errorMessage = null,
        public readonly array   $rawResponse = [],
    ) {}

    public static function success(string $messageId, array $raw = []): self
    {
        return new self(true, $messageId, null, null, $raw);
    }

    public static function failure(string $errorCode, string $errorMessage, array $raw = []): self
    {
        return new self(false, null, $errorCode, $errorMessage, $raw);
    }
}
