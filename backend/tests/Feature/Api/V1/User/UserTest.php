<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('requires authentication to list users', function (): void {
    $this->getJson('/api/v1/users')->assertUnauthorized();
});

it('lists users', function (): void {
    $actor = User::factory()->create();
    User::factory()->count(2)->create();

    Sanctum::actingAs($actor);

    $this->getJson('/api/v1/users')
        ->assertOk()
        ->assertJsonPath('message', 'Users retrieved.')
        ->assertJsonCount(3, 'data.users');
});

it('creates a user', function (): void {
    Sanctum::actingAs(User::factory()->create());

    $response = $this->postJson('/api/v1/users', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertCreated()
        ->assertJsonPath('message', 'User created.')
        ->assertJsonPath('data.user.email', 'jane@example.com');

    $this->assertDatabaseHas('users', [
        'email' => 'jane@example.com',
        'name' => 'Jane Doe',
    ]);
});

it('shows a user', function (): void {
    $actor = User::factory()->create();
    $user = User::factory()->create(['email' => 'show@example.com']);

    Sanctum::actingAs($actor);

    $this->getJson("/api/v1/users/{$user->id}")
        ->assertOk()
        ->assertJsonPath('data.user.id', $user->id)
        ->assertJsonPath('data.user.email', 'show@example.com');
});

it('updates a user', function (): void {
    $actor = User::factory()->create();
    $user = User::factory()->create(['name' => 'Old Name']);

    Sanctum::actingAs($actor);

    $this->putJson("/api/v1/users/{$user->id}", [
        'name' => 'New Name',
        'email' => $user->email,
    ])
        ->assertOk()
        ->assertJsonPath('data.user.name', 'New Name');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'New Name',
    ]);
});

it('deletes a user', function (): void {
    $actor = User::factory()->create();
    $user = User::factory()->create();

    Sanctum::actingAs($actor);

    $this->deleteJson("/api/v1/users/{$user->id}")
        ->assertOk()
        ->assertJsonPath('message', 'User deleted.');

    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});
