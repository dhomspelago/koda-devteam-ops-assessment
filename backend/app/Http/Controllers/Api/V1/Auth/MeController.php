<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Resources\Api\V1\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class MeController extends ApiBaseController
{
    public function __invoke(Request $request): JsonResponse
    {
        return $this->respondOk([
            'message' => 'User retrieved.',
            'data' => [
                'user' => UserResource::make($request->user()),
            ],
        ]);
    }
}
