<?php

declare(strict_types=1);

it('returns a healthy api status', function () {
    $response = $this->getJson('/api/v1/health');

    $response
        ->assertOk()
        ->assertExactJson([
            'status' => 'ok',
            'service' => 'koda-devteam-ops-assessment',
        ]);
});
