<?php

declare(strict_types=1);

namespace App\Routing;

final class Response
{
    private int $statusCode = 200;
    private array $headers = [
        'Content-Type' => 'application/json; charset=utf-8',
    ];
    private mixed $content = null;

    public function status(int $code): self
    {
        $this->statusCode = $code;
        return $this;
    }

    public function header(string $key, string $value): self
    {
        $this->headers[$key] = $value;
        return $this;
    }

    public function json(mixed $data = null, int $code = 200, ?string $message = null): self
    {
        $this->statusCode = $code;
        $this->content = [
            'success' => true,
            'data'    => $data,
            'message' => $message,
        ];
        return $this;
    }

    public function error(string $code, string $message, int $statusCode = 400, array $fields = []): self
    {
        $this->statusCode = $statusCode;
        $this->content = [
            'success' => false,
            'error'   => [
                'code'    => $code,
                'message' => $message,
                'fields'  => $fields,
            ],
        ];
        return $this;
    }

    public function send(): void
    {
        http_response_code($this->statusCode);

        foreach ($this->headers as $name => $value) {
            header("{$name}: {$value}");
        }

        if ($this->content !== null) {
            echo json_encode($this->content, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }

        exit;
    }

    public static function make(): self
    {
        return new self();
    }
}
