<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Database\Connection;
use PDO;
use function App\Support\current_timestamp;

if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->safeLoad();
}

$now  = current_timestamp();
$tick = date('Y-m-d H:i:s');

echo "[{$tick}] JidoSapp Scheduler running...\n";

try {
    $pdo = Connection::get();

    // Find all due scheduled posts
    $stmt = $pdo->prepare("
        SELECT sp.id, sp.workspace_id, sp.content_id, sp.connection_id,
               sp.schedule_type, c.title
        FROM scheduled_posts sp
        JOIN content c ON sp.content_id = c.id
        WHERE sp.status = 'scheduled'
          AND sp.next_run_at <= ?
        ORDER BY sp.next_run_at ASC
        LIMIT 100
    ");
    $stmt->execute([$now]);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $count = count($posts);
    echo "[{$tick}] Found {$count} due scheduled post(s).\n";

    if ($count === 0) {
        echo "[{$tick}] Nothing to do. Exiting.\n";
        exit(0);
    }

    // Connect to Redis
    $redis = null;
    try {
        $redis = new Redis();
        $redis->connect(
            getenv('REDIS_HOST') ?: '127.0.0.1',
            (int)(getenv('REDIS_PORT') ?: 6379)
        );
        echo "[{$tick}] Redis connected.\n";
    } catch (\Throwable $e) {
        echo "[{$tick}] Redis unavailable: {$e->getMessage()}. Using DB queue.\n";
    }

    $queue = getenv('WORKER_QUEUE') ?: 'jidosapp:queue:default';

    foreach ($posts as $post) {
        // Mark as processing to prevent duplicate dispatch
        $markStmt = $pdo->prepare(
            "UPDATE scheduled_posts SET status = 'processing', updated_at = ? WHERE id = ? AND status = 'scheduled'"
        );
        $markStmt->execute([$now, $post['id']]);

        if ($markStmt->rowCount() === 0) {
            // Another scheduler instance already grabbed this post
            continue;
        }

        $jobPayload = json_encode([
            'job'                => 'ProcessScheduledContent',
            'scheduled_post_id'  => $post['id'],
            'workspace_id'       => $post['workspace_id'],
            'content_id'         => $post['content_id'],
            'connection_id'      => $post['connection_id'],
            'queued_at'          => time(),
        ]);

        if ($redis) {
            $redis->rPush($queue, $jobPayload);
        } else {
            // DB queue fallback
            $dbJob = $pdo->prepare("
                INSERT INTO jobs (id, queue, payload, attempts, available_at, created_at)
                VALUES (?, 'default', ?, 0, NOW(), NOW())
            ");
            $dbJob->execute([\App\Support\uuid_v4(), $jobPayload]);
        }

        echo "[{$tick}] Enqueued: {$post['id']} ({$post['title']})\n";
    }

    echo "[{$tick}] Scheduler cycle complete.\n";
} catch (\Throwable $e) {
    echo "[{$tick}] Scheduler error: {$e->getMessage()}\n";
    exit(1);
}
