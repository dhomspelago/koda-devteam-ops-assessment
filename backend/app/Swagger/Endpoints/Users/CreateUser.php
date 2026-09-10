<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Users;

use OpenApi\Attributes as OA;

#[OA\Post(
    path: '/api/v1/users',
    summary: 'Create user',
    description: 'Creates a new user who can log in.',
    security: [['bearerAuth' => []]],
    tags: ['Users'],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name', 'email', 'password', 'password_confirmation'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Jane Doe'),
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'jane@example.com'),
                new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password'),
                new OA\Property(property: 'password_confirmation', type: 'string', format: 'password', example: 'password'),
            ]
        )
    ),
    responses: [
        new OA\Response(
            response: 201,
            description: 'User created',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'User created.'),
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
        new OA\Response(response: 422, description: 'Validation error'),
    ]
)]
class CreateUser
{
}
