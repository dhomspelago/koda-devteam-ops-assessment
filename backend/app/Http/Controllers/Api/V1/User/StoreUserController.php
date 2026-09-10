<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Requests\Api\V1\User\StoreUserRequest;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

final class StoreUserController extends ApiBaseController
{
    public function __invoke(StoreUserRequest $request): JsonResponse
    {
        $user = User::query()->create($request->validated());

        return $this->respondCreated([
            'message' => 'User created.',
            'data' => [
                'user' => UserResource::make($user),
            ],
        ]);
    }
}
