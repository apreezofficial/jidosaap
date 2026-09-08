<?php

declare(strict_types=1);

namespace App\Queue;

interface QueueInterface
{
    /**
     * Push a new job onto the queue.
     *
     * @param string $jobClass
     * @param array $payload
     * @param int $delaySeconds
     * @param string $queue
     * @return string Job ID
     */
    public function push(string $jobClass, array $payload = [], int $delaySeconds = 0, string $queue = 'default'): string;

    /**
     * Pop the next available job from the queue.
     *
     * @param string $queue
     * @param int $timeout
     * @return array|null [ 'id' => ..., 'job' => ..., 'payload' => ..., 'attempts' => ... ]
     */
    public function pop(string $queue = 'default', int $timeout = 0): ?array;

    /**
     * Acknowledge/delete a completed job.
     */
    public function acknowledge(string $jobId, string $queue = 'default'): void;

    /**
     * Mark job as failed and store exception.
     */
    public function fail(array $job, \Throwable $e): void;

    /**
     * Release job back into queue for retry.
     */
    public function release(array $job, int $delaySeconds = 30): void;
}
