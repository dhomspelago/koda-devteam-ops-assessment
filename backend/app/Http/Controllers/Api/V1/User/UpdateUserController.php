<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Requests\Api\V1\User\UpdateUserRequest;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

final class UpdateUserController extends ApiBaseController
{
    public function __invoke(UpdateUserRequest $request, User $user): JsonResponse
    {
        $user->update($request->validated());

        return $this->respondOk([
            'message' => 'User updated.',
            'data' => [
                'user' => UserResource::make($user->fresh()),
            ],
        ]);
    }
}
