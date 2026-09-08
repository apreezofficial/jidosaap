<?php

declare(strict_types=1);

namespace App\Queue;

interface JobInterface
{
    /**
     * Execute the job logic.
     *
     * @param array $payload
     * @return mixed
     */
    public function handle(array $payload): mixed;
}
