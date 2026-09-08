<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Database\MigrationManager;

if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->safeLoad();
}

echo "Running JidoSapp Database Migrations...\n";

try {
    $migrator = new MigrationManager();
    $ran = $migrator->run();

    if (empty($ran)) {
        echo "Nothing to migrate. All migrations are up to date.\n";
    } else {
        foreach ($ran as $file) {
            echo "Migrated: {$file}\n";
        }
        echo "Successfully completed " . count($ran) . " migration(s).\n";
    }
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
