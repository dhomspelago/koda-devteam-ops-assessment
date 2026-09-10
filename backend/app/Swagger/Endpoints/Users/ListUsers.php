<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Users;

use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/api/v1/users',
    summary: 'List users',
    description: 'Returns all users.',
    security: [['bearerAuth' => []]],
    tags: ['Users'],
    responses: [
        new OA\Response(
            response: 200,
            description: 'Users retrieved',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Users retrieved.'),
                    new OA\Property(
                        property: 'data',
                        type: 'object',
                        properties: [
                            new OA\Property(
                                property: 'users',
                                type: 'array',
                                items: new OA\Items(ref: '#/components/schemas/User')
                            ),
                        ]
                    ),
                ]
            )
        ),
        new OA\Response(response: 401, description: 'Unauthenticated'),
    ]
)]
class ListUsers
{
}
