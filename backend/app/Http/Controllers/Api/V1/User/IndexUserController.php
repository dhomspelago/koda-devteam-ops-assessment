<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

final class IndexUserController extends ApiBaseController
{
    public function __invoke(): JsonResponse
    {
        $users = User::query()->get();

        return $this->respondOk([
            'message' => 'Users retrieved.',
            'data' => [
                'users' => UserResource::collection($users),
            ],
        ]);
    }
}
