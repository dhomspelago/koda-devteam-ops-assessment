<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Authentications;

use OpenApi\Attributes as OA;

#[OA\Post(
    path: '/api/v1/logout',
    summary: 'User logout',
    description: 'Revokes the current Sanctum access token.',
    security: [['bearerAuth' => []]],
    tags: ['Authentication'],
    responses: [
        new OA\Response(
            response: 200,
            description: 'Logged out',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Logged out.'),
                ]
            )
        ),
        new OA\Response(response: 401, description: 'Unauthenticated'),
    ]
)]
class Logout
{
}
