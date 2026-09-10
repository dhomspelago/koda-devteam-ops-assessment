<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Authentications;

use OpenApi\Attributes as OA;

#[OA\Post(
    path: '/api/v1/login',
    summary: 'User login',
    description: 'Login using email and password. Returns a Sanctum bearer token.',
    tags: ['Authentication'],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['email', 'password'],
            properties: [
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@example.com'),
                new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password'),
            ]
        )
    ),
    responses: [
        new OA\Response(
            response: 200,
            description: 'Login successful',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Login successful.'),
                    new OA\Property(
                        property: 'data',
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                            new OA\Property(property: 'token', type: 'string', example: '1|XyZExampleSanctumToken'),
                            new OA\Property(property: 'token_type', type: 'string', example: 'Bearer'),
                        ]
                    ),
                ]
            )
        ),
        new OA\Response(
            response: 401,
            description: 'Invalid credentials',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Invalid credentials.'),
                ]
            )
        ),
        new OA\Response(response: 422, description: 'Validation error'),
    ]
)]
class Login
{
}
