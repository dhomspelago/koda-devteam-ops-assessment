<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\MeController;
use App\Http\Controllers\Api\V1\Project\DestroyProjectController;
use App\Http\Controllers\Api\V1\Project\IndexProjectController;
use App\Http\Controllers\Api\V1\Project\ShowProjectController;
use App\Http\Controllers\Api\V1\Project\StoreProjectController;
use App\Http\Controllers\Api\V1\Project\UpdateProjectController;
use App\Http\Controllers\Api\V1\User\DestroyUserController;
use App\Http\Controllers\Api\V1\User\IndexUserController;
use App\Http\Controllers\Api\V1\User\ShowUserController;
use App\Http\Controllers\Api\V1\User\StoreUserController;
use App\Http\Controllers\Api\V1\User\UpdateUserController;
use App\Http\Controllers\HealthController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class)->name('api.v1.health');

Route::post('/login', LoginController::class)->name('api.v1.auth.login');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', LogoutController::class)->name('api.v1.auth.logout');
    Route::get('/me', MeController::class)->name('api.v1.auth.me');

    Route::get('/users', IndexUserController::class)->name('api.v1.users.index');
    Route::post('/users', StoreUserController::class)->name('api.v1.users.store');
    Route::get('/users/{user}', ShowUserController::class)->name('api.v1.users.show');
    Route::put('/users/{user}', UpdateUserController::class)->name('api.v1.users.update');
    Route::patch('/users/{user}', UpdateUserController::class)->name('api.v1.users.patch');
    Route::delete('/users/{user}', DestroyUserController::class)->name('api.v1.users.destroy');

    Route::get('/projects', IndexProjectController::class)->name('api.v1.projects.index');
    Route::post('/projects', StoreProjectController::class)->name('api.v1.projects.store');
    Route::get('/projects/{project}', ShowProjectController::class)->name('api.v1.projects.show');
    Route::put('/projects/{project}', UpdateProjectController::class)->name('api.v1.projects.update');
    Route::patch('/projects/{project}', UpdateProjectController::class)->name('api.v1.projects.patch');
    Route::delete('/projects/{project}', DestroyProjectController::class)->name('api.v1.projects.destroy');
});
