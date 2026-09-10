<?php

declare(strict_types=1);

namespace App\Swagger\Endpoints\Projects;

use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/api/v1/projects',
    summary: 'List projects',
    description: 'Returns a paginated list of projects with optional search, status/priority filters, and sorting.',
    security: [['bearerAuth' => []]],
    tags: ['Projects'],
    parameters: [
        new OA\Parameter(
            name: 'search',
            in: 'query',
            required: false,
            description: 'Partial match on client_name, project_name, or description',
            schema: new OA\Schema(type: 'string', example: 'acme')
        ),
        new OA\Parameter(
            name: 'status',
            in: 'query',
            required: false,
            description: 'Filter by project status',
            schema: new OA\Schema(type: 'string', enum: ['Planning', 'In Progress', 'On Hold', 'Completed'], example: 'In Progress')
        ),
        new OA\Parameter(
            name: 'priority',
            in: 'query',
            required: false,
            description: 'Filter by project priority',
            schema: new OA\Schema(type: 'string', enum: ['Low', 'Medium', 'High'], example: 'High')
        ),
        new OA\Parameter(
            name: 'sort_by',
            in: 'query',
            required: false,
            description: 'Column to sort by',
            schema: new OA\Schema(
                type: 'string',
                enum: ['id', 'client_name', 'project_name', 'status', 'priority', 'start_date', 'due_date', 'created_at'],
                example: 'due_date'
            )
        ),
        new OA\Parameter(
            name: 'sort_dir',
            in: 'query',
            required: false,
            description: 'Sort direction',
            schema: new OA\Schema(type: 'string', enum: ['asc', 'desc'], example: 'asc')
        ),
        new OA\Parameter(
            name: 'page',
            in: 'query',
            required: false,
            description: 'Page number',
            schema: new OA\Schema(type: 'integer', minimum: 1, example: 1)
        ),
        new OA\Parameter(
            name: 'per_page',
            in: 'query',
            required: false,
            description: 'Items per page (default 15, max 100)',
            schema: new OA\Schema(type: 'integer', minimum: 1, maximum: 100, example: 15)
        ),
    ],
    responses: [
        new OA\Response(
            response: 200,
            description: 'Projects retrieved',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Projects retrieved.'),
                    new OA\Property(
                        property: 'data',
                        type: 'object',
                        properties: [
                            new OA\Property(
                                property: 'projects',
                                type: 'array',
                                items: new OA\Items(ref: '#/components/schemas/Project')
                            ),
                            new OA\Property(
                                property: 'meta',
                                type: 'object',
                                properties: [
                                    new OA\Property(property: 'current_page', type: 'integer', example: 1),
                                    new OA\Property(property: 'last_page', type: 'integer', example: 2),
                                    new OA\Property(property: 'per_page', type: 'integer', example: 15),
                                    new OA\Property(property: 'total', type: 'integer', example: 20),
                                ]
                            ),
                            new OA\Property(
                                property: 'links',
                                type: 'object',
                                properties: [
                                    new OA\Property(property: 'first', type: 'string', nullable: true),
                                    new OA\Property(property: 'last', type: 'string', nullable: true),
                                    new OA\Property(property: 'prev', type: 'string', nullable: true),
                                    new OA\Property(property: 'next', type: 'string', nullable: true),
                                ]
                            ),
                        ]
                    ),
                ]
            )
        ),
        new OA\Response(response: 401, description: 'Unauthenticated'),
        new OA\Response(response: 422, description: 'Validation error'),
    ]
)]
class ListProjects
{
}
