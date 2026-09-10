<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Authentications;

use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/api/v1/me',
    summary: 'Current user',
    description: 'Returns the authenticated user.',
    security: [['bearerAuth' => []]],
    tags: ['Authentication'],
    responses: [
        new OA\Response(
            response: 200,
            description: 'User retrieved',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'User retrieved.'),
                    new OA\Property(
                        property: 'data',
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                        ]
                    ),
                ]
            )
        ),
        new OA\Response(response: 401, description: 'Unauthenticated'),
    ]
)]
class Me
{
}
