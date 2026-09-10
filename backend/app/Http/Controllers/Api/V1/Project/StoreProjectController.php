<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Project;

use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Requests\Api\V1\Project\StoreProjectRequest;
use App\Http\Resources\Api\V1\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

final class StoreProjectController extends ApiBaseController
{
    public function __invoke(StoreProjectRequest $request): JsonResponse
    {
        $project = Project::query()->create($request->validated());

        return $this->respondCreated([
            'message' => 'Project created.',
            'data' => [
                'project' => ProjectResource::make($project),
            ],
        ]);
    }
}
