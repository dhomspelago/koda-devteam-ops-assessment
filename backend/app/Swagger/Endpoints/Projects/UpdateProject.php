<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Projects;

use OpenApi\Attributes as OA;

#[OA\Put(
    path: '/api/v1/projects/{project}',
    summary: 'Update project',
    description: 'Updates an existing project. All fields are optional.',
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
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'client_name', type: 'string', example: 'Acme Corp'),
                new OA\Property(property: 'project_name', type: 'string', example: 'Website Redesign'),
                new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Updated description.'),
                new OA\Property(property: 'status', type: 'string', enum: ['Planning', 'In Progress', 'On Hold', 'Completed'], example: 'In Progress'),
                new OA\Property(property: 'priority', type: 'string', enum: ['Low', 'Medium', 'High'], example: 'Medium'),
                new OA\Property(property: 'start_date', type: 'string', format: 'date', nullable: true, example: '2026-01-01'),
                new OA\Property(property: 'due_date', type: 'string', format: 'date', nullable: true, example: '2026-06-01'),
            ]
        )
    ),
    responses: [
        new OA\Response(
            response: 200,
            description: 'Project updated',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Project updated.'),
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
        new OA\Response(response: 422, description: 'Validation error'),
    ]
)]
class UpdateProject
{
}
