<?php

declare(strict_types=1);

it('returns a successful response from the api root', function () {
    $response = $this->getJson('/');

    $response
        ->assertOk()
        ->assertJsonPath('service', 'koda-devteam-ops-assessment');
});
