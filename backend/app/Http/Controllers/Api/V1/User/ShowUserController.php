<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

final class ShowUserController extends ApiBaseController
{
    public function __invoke(User $user): JsonResponse
    {
        return $this->respondOk([
            'message' => 'User retrieved.',
            'data' => [
                'user' => UserResource::make($user),
            ],
        ]);
    }
}
