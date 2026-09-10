<?php

declare(strict_types=1);

namespace App\Swagger\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'User',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Admin'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@example.com'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-09-10T06:00:00.000000Z'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', example: '2026-09-10T06:00:00.000000Z'),
    ]
)]
class User
{
}
