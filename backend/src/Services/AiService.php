<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\AppConfig;
use RuntimeException;

/**
 * AI Service — Abstracted provider for OpenAI.
 * Future providers (Anthropic, Gemini) can be added by swapping the provider.
 */
final class AiService
{
    private const DEFAULT_MODEL  = 'gpt-4o-mini';
    private const DEFAULT_TOKENS = 1024;

    /**
     * Generate text content using AI.
     *
     * @param string $systemPrompt  Instructions kept confidential from customer
     * @param string $userMessage   The actual request / context
     * @param array  $options       Optional overrides: model, max_tokens, temperature
     */
    public function generate(string $systemPrompt, string $userMessage, array $options = []): string
    {
        $apiKey = AppConfig::openAiApiKey();
        if (empty($apiKey)) {
            throw new RuntimeException("OpenAI API key is not configured", 503);
        }

        $model     = $options['model']       ?? self::DEFAULT_MODEL;
        $maxTokens = $options['max_tokens']  ?? self::DEFAULT_TOKENS;
        $temp      = $options['temperature'] ?? 0.7;

        $payload = [
            'model'       => $model,
            'max_tokens'  => $maxTokens,
            'temperature' => $temp,
            'messages'    => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user',   'content' => $userMessage],
            ],
        ];

        $ch = curl_init('https://api.openai.com/v1/chat/completions');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_TIMEOUT    => 30,
        ]);

        $body      = curl_exec($ch);
        $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            throw new RuntimeException("AI request failed: {$curlError}", 502);
        }

        $response = json_decode($body ?: '{}', true);

        if ($httpCode !== 200 || isset($response['error'])) {
            $errMsg = $response['error']['message'] ?? "OpenAI API error (HTTP {$httpCode})";
            throw new RuntimeException($errMsg, 502);
        }

        return trim($response['choices'][0]['message']['content'] ?? '');
    }

    /**
     * Rewrite a WhatsApp message with a different tone.
     */
    public function rewrite(string $content, string $tone): string
    {
        $system = "You are a WhatsApp business copywriter. Rewrite the given message in a {$tone} tone. Keep it concise, under 500 characters when possible. Return only the rewritten message, no commentary.";
        return $this->generate($system, $content);
    }

    /**
     * Generate WhatsApp content from a structured data object.
     *
     * @param array  $data    e.g. ['product' => 'iPhone', 'price' => 1200, 'stock' => 4]
     * @param string $prompt  User-written prompt template with {{variable}} placeholders
     * @param string $tone    professional, friendly, sales, etc.
     */
    public function generateFromData(array $data, string $prompt, string $tone = 'professional'): string
    {
        // Resolve {{variable}} placeholders in prompt
        $resolved = $prompt;
        foreach ($data as $key => $value) {
            $resolved = str_replace('{{' . $key . '}}', (string)$value, $resolved);
        }

        $system = "You are a WhatsApp business content creator. Generate a concise, engaging WhatsApp message based on the given information. Tone: {$tone}. Use appropriate emojis sparingly. Maximum 500 characters unless the user explicitly requests more.";

        return $this->generate($system, $resolved);
    }

    /**
     * Classify customer message intent.
     */
    public function classifyIntent(string $message): array
    {
        $system = "Classify the following customer WhatsApp message into one of these intents: sales_inquiry, support_request, general_question, complaint, order_status, price_inquiry, product_info, other. Return a JSON object with keys: intent (string), confidence (0.0-1.0), requires_human (boolean).";

        try {
            $result = $this->generate($system, $message, ['temperature' => 0.3, 'max_tokens' => 100]);
            return json_decode($result, true) ?? ['intent' => 'other', 'confidence' => 0.5, 'requires_human' => false];
        } catch (\Throwable) {
            return ['intent' => 'other', 'confidence' => 0.5, 'requires_human' => false];
        }
    }

    /**
     * Track AI token usage for billing.
     */
    private function trackUsage(string $workspaceId, int $inputTokens, int $outputTokens): void
    {
        try {
            $billing = new BillingService();
            $billing->trackUsage($workspaceId, 'ai_tokens', $inputTokens + $outputTokens);
            $billing->trackUsage($workspaceId, 'ai_requests', 1);
        } catch (\Throwable) {
            // Non-critical
        }
    }
}
