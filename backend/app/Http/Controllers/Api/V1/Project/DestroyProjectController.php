<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Project;

use App\Http\Controllers\Api\ApiBaseController;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

final class DestroyProjectController extends ApiBaseController
{
    public function __invoke(Project $project): JsonResponse
    {
        $project->delete();

        return $this->respondOk([
            'message' => 'Project deleted.',
        ]);
    }
}
