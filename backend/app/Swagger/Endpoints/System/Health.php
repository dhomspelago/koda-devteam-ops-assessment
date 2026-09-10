<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\System;

use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/api/v1/health',
    summary: 'Health check',
    description: 'Returns API health status.',
    tags: ['System'],
    responses: [
        new OA\Response(
            response: 200,
            description: 'API is healthy',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'status', type: 'string', example: 'ok'),
                    new OA\Property(property: 'service', type: 'string', example: 'koda-devteam-ops-assessment'),
                ]
            )
        ),
    ]
)]
class Health
{
}
