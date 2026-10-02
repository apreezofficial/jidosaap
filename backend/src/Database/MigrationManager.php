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
                if ($driver === 'sqlite') {
                    $this->executeSqliteScript($sql);
                } else {
                    $this->pdo->exec($sql);
                }

                $stmt = $this->pdo->prepare("
                    INSERT INTO migrations (id, migration, batch, executed_at) 
                    VALUES (?, ?, ?, ?)
                ");
                $id = \App\Support\uuid_v4();
                $stmt->execute([$id, $fileName, $batch, current_timestamp()]);

                $this->pdo->commit();
                $ran[] = $fileName;
            } catch (\Throwable $e) {
                if ($this->pdo->inTransaction()) {
                    $this->pdo->rollBack();
                }
                throw new \RuntimeException("Migration {$fileName} failed: " . $e->getMessage(), 0, $e);
            }
        }

        return $ran;
    }

    private function executeSqliteScript(string $sql): void
    {
        // Strip multi-line and single-line comments
        $sqlClean = preg_replace('!/\*.*?\*/!s', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sqlClean)));

        foreach ($statements as $stmt) {
            $stmt = preg_replace('/--[^\r\n]*/', '', $stmt);
            $stmt = trim($stmt);
            if (empty($stmt)) {
                continue;
            }

            // Check if statement is ALTER TABLE ... ADD COLUMN
            if (preg_match('/^ALTER\s+TABLE\s+([a-zA-Z0-9_]+)\s+ADD\s+(?:COLUMN\s+)?(.+)$/is', $stmt, $matches)) {
                $table = $matches[1];
                $columnsPart = $matches[2];

                // Get existing columns
                $info = $this->pdo->query("PRAGMA table_info({$table})")->fetchAll(PDO::FETCH_ASSOC);
                $existingCols = array_map(fn($c) => strtolower($c['name']), $info);

                // Multiple columns might be comma separated
                $colDefs = explode(',', $columnsPart);
                foreach ($colDefs as $colDef) {
                    $colDef = trim($colDef);
                    $colDefClean = preg_replace('/^ADD\s+COLUMN\s+/i', '', $colDef);
                    $colDefClean = preg_replace('/^ADD\s+/i', '', $colDefClean);
                    $colDefClean = preg_replace('/IF\s+NOT\s+EXISTS\s+/i', '', $colDefClean);
                    $colDefClean = trim($colDefClean);
                    
                    if (preg_match('/^([a-zA-Z0-9_]+)\s+(.+)$/is', $colDefClean, $cm)) {
                        $colName = strtolower($cm[1]);
                        if (!in_array($colName, $existingCols, true)) {
                            try {
                                $this->pdo->exec("ALTER TABLE {$table} ADD COLUMN {$colDefClean}");
                                $existingCols[] = $colName;
                            } catch (\Throwable) {
                                // Ignore if already added
                            }
                        }
                    }
                }
                continue;
            }

            try {
                $this->pdo->exec($stmt);
            } catch (\Throwable $e) {
                // If it's index already exists or column already exists, tolerate
                $msg = $e->getMessage();
                if (stripos($msg, 'already exists') !== false || stripos($msg, 'duplicate column') !== false) {
                    continue;
                }
                throw $e;
            }
        }
    }

    private function adaptSqlForSqlite(string $sql): string
    {
        // Remove postgres extensions
        $sql = preg_replace('/CREATE EXTENSION[^;]+;/i', '', $sql);
        $sql = str_ireplace(['NUMERIC(10, 2)', 'NUMERIC(12, 2)', 'NUMERIC'], 'REAL', $sql);
        $sql = str_ireplace('SMALLINT', 'INTEGER', $sql);
        return $sql;
    }
}
