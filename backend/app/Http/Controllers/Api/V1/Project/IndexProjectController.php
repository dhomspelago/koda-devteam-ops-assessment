<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Project;

use App\DTOs\Project\ProjectIndexQuery;
use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Requests\Api\V1\Project\IndexProjectRequest;
use App\Http\Resources\Api\V1\ProjectResource;
use App\Services\Project\ProjectQueryService;
use Illuminate\Http\JsonResponse;

final class IndexProjectController extends ApiBaseController
{
    public function __invoke(
        IndexProjectRequest $request,
        ProjectQueryService $projectQueryService
    ): JsonResponse {
        $projects = $projectQueryService->paginate(
            ProjectIndexQuery::fromValidated($request->validated())
        );

        return $this->respondOk([
            'message' => 'Projects retrieved.',
            'data' => [
                'projects' => ProjectResource::collection($projects->items()),
                'meta' => [
                    'current_page' => $projects->currentPage(),
                    'last_page' => $projects->lastPage(),
                    'per_page' => $projects->perPage(),
                    'total' => $projects->total(),
                ],
                'links' => [
                    'first' => $projects->url(1),
                    'last' => $projects->url($projects->lastPage()),
                    'prev' => $projects->previousPageUrl(),
                    'next' => $projects->nextPageUrl(),
                ],
            ],
        ]);
    }
}
