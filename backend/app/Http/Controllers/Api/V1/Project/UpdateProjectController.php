<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Project;

use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Requests\Api\V1\Project\UpdateProjectRequest;
use App\Http\Resources\Api\V1\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

final class UpdateProjectController extends ApiBaseController
{
    public function __invoke(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $project->update($request->validated());

        return $this->respondOk([
            'message' => 'Project updated.',
            'data' => [
                'project' => ProjectResource::make($project->fresh()),
            ],
        ]);
    }
}
