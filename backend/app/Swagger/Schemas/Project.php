<?php

declare(strict_types=1);

namespace App\Swagger\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'Project',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'client_name', type: 'string', example: 'Acme Corp'),
        new OA\Property(property: 'project_name', type: 'string', example: 'Website Redesign'),
        new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Full redesign of the marketing site.'),
        new OA\Property(property: 'status', type: 'string', enum: ['Planning', 'In Progress', 'On Hold', 'Completed'], example: 'Planning'),
        new OA\Property(property: 'priority', type: 'string', enum: ['Low', 'Medium', 'High'], example: 'High'),
        new OA\Property(property: 'start_date', type: 'string', format: 'date', nullable: true, example: '2026-01-01'),
        new OA\Property(property: 'due_date', type: 'string', format: 'date', nullable: true, example: '2026-06-01'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-09-10T06:00:00.000000Z'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', example: '2026-09-10T06:00:00.000000Z'),
    ]
)]
class Project
{
}
