<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Projects;

use OpenApi\Attributes as OA;

#[OA\Delete(
    path: '/api/v1/projects/{project}',
    summary: 'Delete project',
    description: 'Deletes a project by ID.',
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
            description: 'Project deleted',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Project deleted.'),
                ]
            )
        ),
        new OA\Response(response: 401, description: 'Unauthenticated'),
        new OA\Response(response: 404, description: 'Project not found'),
    ]
)]
class DeleteProject
{
}
