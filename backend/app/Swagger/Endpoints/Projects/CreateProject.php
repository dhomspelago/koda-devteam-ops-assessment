<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Projects;

use OpenApi\Attributes as OA;

#[OA\Post(
    path: '/api/v1/projects',
    summary: 'Create project',
    description: 'Creates a new project.',
    security: [['bearerAuth' => []]],
    tags: ['Projects'],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['client_name', 'project_name', 'status', 'priority'],
            properties: [
                new OA\Property(property: 'client_name', type: 'string', example: 'Acme Corp'),
                new OA\Property(property: 'project_name', type: 'string', example: 'Website Redesign'),
                new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Full redesign of the marketing site.'),
                new OA\Property(property: 'status', type: 'string', enum: ['Planning', 'In Progress', 'On Hold', 'Completed'], example: 'Planning'),
                new OA\Property(property: 'priority', type: 'string', enum: ['Low', 'Medium', 'High'], example: 'High'),
                new OA\Property(property: 'start_date', type: 'string', format: 'date', nullable: true, example: '2026-01-01'),
                new OA\Property(property: 'due_date', type: 'string', format: 'date', nullable: true, example: '2026-06-01'),
            ]
        )
    ),
    responses: [
        new OA\Response(
            response: 201,
            description: 'Project created',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Project created.'),
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
        new OA\Response(response: 422, description: 'Validation error'),
    ]
)]
class CreateProject
{
}
