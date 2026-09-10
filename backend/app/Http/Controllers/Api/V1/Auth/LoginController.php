<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

final class LoginController extends ApiBaseController
{
    public function __invoke(LoginRequest $request): JsonResponse
    {
        /** @var User|null $user */
        $user = User::query()->where('email', $request->string('email')->toString())->first();

        if ($user === null || ! Hash::check($request->string('password')->toString(), $user->password)) {
            return $this->respondUnauthorized('Invalid credentials.');
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->respondOk([
            'message' => 'Login successful.',
            'data' => [
                'user' => UserResource::make($user),
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ]);
    }
}
