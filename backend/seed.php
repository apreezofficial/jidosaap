<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Seeders\DemoSeeder;

if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->safeLoad();
}

echo "Seeding JidoSapp Demo Data...\n";

try {
    $seeder = new DemoSeeder();
    $result = $seeder->run();

    echo "Demo seeding successful!\n";
    echo "----------------------------------------\n";
    echo "Demo Email:    {$result['demo_user']}\n";
    echo "Demo Password: {$result['demo_password']}\n";
    echo "Workspace:     {$result['workspace_slug']}\n";
    echo "----------------------------------------\n";
} catch (\Throwable $e) {
    echo "Seeding error: " . $e->getMessage() . "\n";
    exit(1);
}
