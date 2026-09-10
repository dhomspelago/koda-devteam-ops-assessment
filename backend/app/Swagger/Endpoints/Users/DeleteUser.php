<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Users;

use OpenApi\Attributes as OA;

#[OA\Delete(
    path: '/api/v1/users/{user}',
    summary: 'Delete user',
    description: 'Deletes a user by ID.',
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
            description: 'User deleted',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'User deleted.'),
                ]
            )
        ),
        new OA\Response(response: 401, description: 'Unauthenticated'),
        new OA\Response(response: 404, description: 'User not found'),
    ]
)]
class DeleteUser
{
}
