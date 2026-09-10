<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('logs in with valid credentials', function (): void {
    $user = User::factory()->create([
        'email' => 'admin@example.com',
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => 'admin@example.com',
        'password' => 'password',
    ]);

    $response->assertOk()
        ->assertJsonPath('message', 'Login successful.')
        ->assertJsonPath('data.user.id', $user->id)
        ->assertJsonStructure([
            'data' => ['user', 'token', 'token_type'],
        ]);
});

it('rejects invalid credentials', function (): void {
    User::factory()->create([
        'email' => 'admin@example.com',
        'password' => 'password',
    ]);

    $this->postJson('/api/v1/login', [
        'email' => 'admin@example.com',
        'password' => 'wrong-password',
    ])->assertUnauthorized()
        ->assertJsonPath('message', 'Invalid credentials.');
});

it('returns the authenticated user on me', function (): void {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $this->getJson('/api/v1/me')
        ->assertOk()
        ->assertJsonPath('data.user.id', $user->id)
        ->assertJsonPath('data.user.email', $user->email);
});

it('requires authentication for me', function (): void {
    $this->getJson('/api/v1/me')->assertUnauthorized();
});

it('logs out and revokes the current token', function (): void {
    $user = User::factory()->create();
    $plainTextToken = $user->createToken('auth_token')->plainTextToken;

    expect($user->tokens()->count())->toBe(1);

    $this->withToken($plainTextToken)
        ->postJson('/api/v1/logout')
        ->assertOk()
        ->assertJsonPath('message', 'Logged out.');

    expect($user->fresh()->tokens()->count())->toBe(0);

    $this->app['auth']->forgetGuards();

    $this->withToken($plainTextToken)
        ->getJson('/api/v1/me')
        ->assertUnauthorized();
});
