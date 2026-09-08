<?php

declare(strict_types=1);

namespace App\Providers\Storage;

use App\Config\AppConfig;

final class LocalStorageProvider implements StorageProviderInterface
{
    private string $baseDir;

    public function __construct(?string $baseDir = null)
    {
        $this->baseDir = $baseDir ?? dirname(__DIR__, 3) . '/storage/uploads';
        if (!is_dir($this->baseDir)) {
            mkdir($this->baseDir, 0777, true);
        }
    }

    public function put(string $path, string $contents, ?string $mimeType = null): string
    {
        $fullPath = $this->baseDir . '/' . ltrim($path, '/');
        $dir = dirname($fullPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        file_put_contents($fullPath, $contents);
        return AppConfig::appUrl() . '/uploads/' . ltrim($path, '/');
    }

    public function get(string $path): ?string
    {
        $fullPath = $this->baseDir . '/' . ltrim($path, '/');
        if (!file_exists($fullPath)) {
            return null;
        }
        return file_get_contents($fullPath) ?: null;
    }

    public function delete(string $path): bool
    {
        $fullPath = $this->baseDir . '/' . ltrim($path, '/');
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }
        return false;
    }

    public function exists(string $path): bool
    {
        $fullPath = $this->baseDir . '/' . ltrim($path, '/');
        return file_exists($fullPath);
    }
}
