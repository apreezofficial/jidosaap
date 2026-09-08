<?php

declare(strict_types=1);

namespace App\Providers\Storage;

interface StorageProviderInterface
{
    /**
     * Put file contents to storage.
     *
     * @param string $path
     * @param string $contents
     * @param string|null $mimeType
     * @return string Public or signed URL
     */
    public function put(string $path, string $contents, ?string $mimeType = null): string;

    /**
     * Get file contents.
     */
    public function get(string $path): ?string;

    /**
     * Delete file from storage.
     */
    public function delete(string $path): bool;

    /**
     * Check if file exists.
     */
    public function exists(string $path): bool;
}
