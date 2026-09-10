<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Users;

use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/api/v1/users/{user}',
    summary: 'Show user',
    description: 'Returns a single user by ID.',
    security: [['bearerAuth' => []]],
    tags: ['Users'],
    parameters: [
        new OA\Parameter(
            name: 'user',
            in: 'path',
            required: true,
            schema: new OA\Schema(type: 'integer', example: 1)
        ),
    ],
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
        new OA\Response(response: 404, description: 'User not found'),
    ]
)]
class ShowUser
{
}
