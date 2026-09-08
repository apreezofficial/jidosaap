<?php

declare(strict_types=1);

namespace App\Database;

use PDO;
use PDOException;
use RuntimeException;
use function App\Support\env;

final class Connection
{
    private static ?PDO $pdo = null;

    public static function get(): PDO
    {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        $url = env('DATABASE_URL');
        $driver = env('DATABASE_DRIVER', 'pgsql');

        try {
            if ($driver === 'sqlite' || ($url && str_starts_with((string) $url, 'sqlite:'))) {
                $dbPath = $url ? substr((string) $url, 7) : env('DATABASE_NAME', 'storage/database.sqlite');
                if (!str_starts_with($dbPath, '/') && !preg_match('/^[A-Za-z]:[\\\\\/]/', $dbPath)) {
                    $dbPath = dirname(__DIR__, 2) . '/' . ltrim($dbPath, '/\\');
                }
                $dir = dirname($dbPath);
                if (!is_dir($dir)) {
                    mkdir($dir, 0777, true);
                }
                $dsn = 'sqlite:' . $dbPath;
                self::$pdo = new PDO($dsn, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_TIMEOUT => 10,
                ]);
                self::$pdo->exec('PRAGMA foreign_keys = ON;');
                return self::$pdo;
            }

            // PostgreSQL
            if ($url && str_starts_with((string) $url, 'pgsql:')) {
                // Parse options or credentials if embedded
                $parsed = parse_url((string) $url);
                if (isset($parsed['scheme']) && $parsed['scheme'] === 'pgsql') {
                    $host = $parsed['host'] ?? '127.0.0.1';
                    $port = $parsed['port'] ?? 5432;
                    $dbname = ltrim($parsed['path'] ?? 'jidosapp', '/');
                    $user = $parsed['user'] ?? env('DATABASE_USER', 'postgres');
                    $pass = $parsed['pass'] ?? env('DATABASE_PASSWORD', 'postgres');
                    $dsn = "pgsql:host={$host};port={$port};dbname={$dbname}";
                    self::$pdo = new PDO($dsn, $user, $pass, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]);
                    return self::$pdo;
                }
            }

            $host   = env('DB_HOST', env('DATABASE_HOST', '127.0.0.1'));
            $port   = env('DB_PORT', env('DATABASE_PORT', 5432));
            $dbname = env('DB_DATABASE', env('DATABASE_NAME', 'jidosapp'));
            $user   = env('DB_USERNAME', env('DATABASE_USER', 'postgres'));
            $pass   = env('DB_PASSWORD', env('DATABASE_PASSWORD', 'postgres'));
            $dsn = "pgsql:host={$host};port={$port};dbname={$dbname}";

            self::$pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);

            return self::$pdo;
        } catch (PDOException $e) {
            throw new RuntimeException("Database connection failed: " . $e->getMessage(), (int) $e->getCode(), $e);
        }
    }

    public static function transaction(callable $callback): mixed
    {
        $pdo = self::get();
        if ($pdo->inTransaction()) {
            return $callback($pdo);
        }

        $pdo->beginTransaction();
        try {
            $result = $callback($pdo);
            $pdo->commit();
            return $result;
        } catch (\Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public static function reset(): void
    {
        self::$pdo = null;
    }
}
