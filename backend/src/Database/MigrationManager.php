<?php

declare(strict_types=1);

namespace App\Database;

use PDO;
use function App\Support\current_timestamp;

final class MigrationManager
{
    public function __construct(private ?PDO $pdo = null)
    {
        $this->pdo = $this->pdo ?? Connection::get();
    }

    public function run(): array
    {
        $driver = $this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

        // Ensure migrations tracking table exists
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS migrations (
                id VARCHAR(36) PRIMARY KEY,
                migration VARCHAR(255) NOT NULL,
                batch INTEGER NOT NULL,
                executed_at TIMESTAMP NOT NULL
            );
        ");

        $executed = $this->pdo->query("SELECT migration FROM migrations")->fetchAll(PDO::FETCH_COLUMN);

        $migrationsDir = dirname(__DIR__, 2) . '/migrations';
        if (!is_dir($migrationsDir)) {
            return [];
        }

        $files = glob($migrationsDir . '/*.sql');
        sort($files);

        $ran = [];
        $batch = (int) ($this->pdo->query("SELECT COALESCE(MAX(batch), 0) FROM migrations")->fetchColumn()) + 1;

        foreach ($files as $filePath) {
            $fileName = basename($filePath);
            if (in_array($fileName, $executed, true)) {
                continue;
            }

            $sql = file_get_contents($filePath);
            if ($sql === false) {
                continue;
            }

            // Adapt SQL if running in SQLite mode
            if ($driver === 'sqlite') {
                $sql = $this->adaptSqlForSqlite($sql);
            }

            $this->pdo->beginTransaction();
            try {
                // Execute individual statements if needed or entire script
                $this->pdo->exec($sql);

                $stmt = $this->pdo->prepare("
                    INSERT INTO migrations (id, migration, batch, executed_at) 
                    VALUES (?, ?, ?, ?)
                ");
                $id = \App\Support\uuid_v4();
                $stmt->execute([$id, $fileName, $batch, current_timestamp()]);

                $this->pdo->commit();
                $ran[] = $fileName;
            } catch (\Throwable $e) {
                $this->pdo->rollBack();
                throw new \RuntimeException("Migration {$fileName} failed: " . $e->getMessage(), 0, $e);
            }
        }

        return $ran;
    }

    private function adaptSqlForSqlite(string $sql): string
    {
        // Remove postgres extensions
        $sql = preg_replace('/CREATE EXTENSION[^;]+;/i', '', $sql);
        // Replace TIMESTAMP with TEXT/DATETIME for sqlite
        // Replace NUMERIC(x, y) with REAL
        // Replace SMALLINT with INTEGER
        $sql = str_ireplace(['NUMERIC(10, 2)', 'NUMERIC(12, 2)', 'NUMERIC'], 'REAL', $sql);
        $sql = str_ireplace('SMALLINT', 'INTEGER', $sql);
        return $sql;
    }
}
