<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Routing\Request;
use App\Routing\Response;
use App\Services\AiService;
use Throwable;

final class AiController
{
    private AiService $aiService;

    public function __construct()
    {
        $this->aiService = new AiService();
    }

    public function generate(Request $request, Response $response): void
    {
        $prompt = (string) $request->input('prompt', '');
        $tone   = (string) $request->input('tone', 'professional');
        $data   = $request->input('data', []);

        if (empty($prompt)) {
            $response->error('VALIDATION_ERROR', 'Prompt is required', 422)->send();
            return;
        }

        try {
            $content = empty($data)
                ? $this->aiService->generate(
                    "You are a WhatsApp business content writer. Tone: {$tone}. Return only the WhatsApp message, no commentary.",
                    $prompt
                )
                : $this->aiService->generateFromData((array) $data, $prompt, $tone);

            $response->json(['content' => $content])->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 502;
            $response->error('AI_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function rewrite(Request $request, Response $response): void
    {
        $content = (string) $request->input('content', '');
        $tone    = (string) $request->input('tone', 'professional');

        if (empty($content)) {
            $response->error('VALIDATION_ERROR', 'Content is required', 422)->send();
            return;
        }

        try {
            $rewritten = $this->aiService->rewrite($content, $tone);
            $response->json(['content' => $rewritten])->send();
        } catch (Throwable $e) {
            $code = $e->getCode() >= 400 && $e->getCode() < 600 ? (int) $e->getCode() : 502;
            $response->error('AI_FAILED', $e->getMessage(), $code)->send();
        }
    }

    public function classifyIntent(Request $request, Response $response): void
    {
        $message = (string) $request->input('message', '');

        if (empty($message)) {
            $response->error('VALIDATION_ERROR', 'Message is required', 422)->send();
            return;
        }

        try {
            $result = $this->aiService->classifyIntent($message);
            $response->json($result)->send();
        } catch (Throwable $e) {
            $response->error('AI_FAILED', $e->getMessage(), 502)->send();
        }
    }
}
