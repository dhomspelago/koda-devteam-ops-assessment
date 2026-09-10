<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Project;

use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Resources\Api\V1\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

final class ShowProjectController extends ApiBaseController
{
    public function __invoke(Project $project): JsonResponse
    {
        return $this->respondOk([
            'message' => 'Project retrieved.',
            'data' => [
                'project' => ProjectResource::make($project),
            ],
        ]);
    }
}
