<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Api\ApiBaseController;
use App\Models\User;
use Illuminate\Http\JsonResponse;

final class DestroyUserController extends ApiBaseController
{
    public function __invoke(User $user): JsonResponse
    {
        $user->delete();

        return $this->respondOk([
            'message' => 'User deleted.',
        ]);
    }
}
