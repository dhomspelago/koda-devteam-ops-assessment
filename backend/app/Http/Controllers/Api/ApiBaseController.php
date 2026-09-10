<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

abstract class ApiBaseController extends Controller
{
    protected function respondBadRequest(string $message): JsonResponse
    {
        return new JsonResponse([
            'message' => $message,
        ], ResponseAlias::HTTP_BAD_REQUEST);
    }

    /**
     * @param  array<mixed>  $data
     * @param  array<mixed>  $headers
     */
    protected function respondOk(array $data = [], array $headers = []): JsonResponse
    {
        return new JsonResponse(
            $data,
            ResponseAlias::HTTP_OK,
            $headers
        );
    }

    /**
     * @param  array<mixed>  $data
     * @param  array<mixed>  $headers
     */
    protected function respondCreated(array $data = [], array $headers = []): JsonResponse
    {
        return new JsonResponse(
            $data,
            ResponseAlias::HTTP_CREATED,
            $headers
        );
    }

    protected function respondError(string $message, ?int $status = null): JsonResponse
    {
        return new JsonResponse([
            'message' => $message,
        ], $status ?? ResponseAlias::HTTP_BAD_REQUEST);
    }

    protected function respondNotFound(string $message): JsonResponse
    {
        return new JsonResponse([
            'message' => $message,
        ], ResponseAlias::HTTP_NOT_FOUND);
    }

    protected function respondNoContent(): JsonResponse
    {
        return new JsonResponse([], ResponseAlias::HTTP_NO_CONTENT);
    }

    protected function respondUnauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return new JsonResponse([
            'message' => $message,
        ], ResponseAlias::HTTP_UNAUTHORIZED);
    }

    protected function respondForbidden(string $message = 'Forbidden'): JsonResponse
    {
        return new JsonResponse([
            'message' => $message,
        ], ResponseAlias::HTTP_FORBIDDEN);
    }
}
