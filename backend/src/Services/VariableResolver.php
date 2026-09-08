<?php

declare(strict_types=1);

namespace App\Services;

final class VariableResolver
{
    /**
     * Resolve {{variable.path}} tokens in a template string safely without eval().
     *
     * @param string $template
     * @param array<string, mixed> $context
     * @return string
     */
    public static function resolve(string $template, array $context = []): string
    {
        // Inject built-in context variables
        $context['current_date'] = date('Y-m-d');
        $context['current_time'] = date('H:i:s');
        $context['current_datetime'] = date('Y-m-d H:i:s');

        return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}/', function ($matches) use ($context) {
            $keyPath = $matches[1];
            $value = self::getValueByPath($context, $keyPath);

            if ($value === null) {
                return $matches[0]; // Keep placeholder if key not found
            }

            if (is_scalar($value)) {
                return (string) $value;
            }

            return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }, $template);
    }

    /**
     * Traverse nested associative arrays using dot notation.
     */
    public static function getValueByPath(array $data, string $path): mixed
    {
        $keys = explode('.', $path);
        $current = $data;

        foreach ($keys as $key) {
            if (is_array($current) && array_key_exists($key, $current)) {
                $current = $current[$key];
            } else {
                return null;
            }
        }

        return $current;
    }
}
