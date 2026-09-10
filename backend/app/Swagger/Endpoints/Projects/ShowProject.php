<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Projects;

use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/api/v1/projects/{project}',
    summary: 'Show project',
    description: 'Returns a single project by ID.',
    security: [['bearerAuth' => []]],
    tags: ['Projects'],
    parameters: [
        new OA\Parameter(
            name: 'project',
            in: 'path',
            required: true,
            schema: new OA\Schema(type: 'integer', example: 1)
        ),
    ],
    responses: [
        new OA\Response(
            response: 200,
            description: 'Project retrieved',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Project retrieved.'),
                    new OA\Property(
                        property: 'data',
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'project', ref: '#/components/schemas/Project'),
                        ]
                    ),
                ]
            )
        ),
        new OA\Response(response: 401, description: 'Unauthenticated'),
        new OA\Response(response: 404, description: 'Project not found'),
    ]
)]
class ShowProject
{
}
