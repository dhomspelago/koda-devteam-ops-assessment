<?php

declare(strict_types=1);

use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('requires authentication to list projects', function (): void {
    $this->getJson('/api/v1/projects')->assertUnauthorized();
});

it('lists projects', function (): void {
    Sanctum::actingAs(User::factory()->create());
    Project::factory()->count(3)->create();

    $this->getJson('/api/v1/projects')
        ->assertOk()
        ->assertJsonPath('message', 'Projects retrieved.')
        ->assertJsonCount(3, 'data.projects')
        ->assertJsonPath('data.meta.total', 3)
        ->assertJsonPath('data.meta.current_page', 1)
        ->assertJsonPath('data.meta.per_page', 15);
});

it('paginates projects', function (): void {
    Sanctum::actingAs(User::factory()->create());
    Project::factory()->count(5)->create();

    $response = $this->getJson('/api/v1/projects?per_page=2&page=2')
        ->assertOk()
        ->assertJsonCount(2, 'data.projects')
        ->assertJsonPath('data.meta.current_page', 2)
        ->assertJsonPath('data.meta.per_page', 2)
        ->assertJsonPath('data.meta.total', 5)
        ->assertJsonPath('data.meta.last_page', 3);

    expect($response->json('data.links.prev'))->toBeString()->not->toBeEmpty()
        ->and($response->json('data.links.next'))->toBeString()->not->toBeEmpty();
});

it('creates a project', function (): void {
    Sanctum::actingAs(User::factory()->create());

    $response = $this->postJson('/api/v1/projects', [
        'client_name' => 'Acme Corp',
        'project_name' => 'Website Redesign',
        'description' => 'Full redesign of the marketing site.',
        'status' => ProjectStatus::Planning->value,
        'priority' => ProjectPriority::High->value,
        'start_date' => '2026-01-01',
        'due_date' => '2026-06-01',
    ]);

    $response->assertCreated()
        ->assertJsonPath('message', 'Project created.')
        ->assertJsonPath('data.project.client_name', 'Acme Corp')
        ->assertJsonPath('data.project.project_name', 'Website Redesign')
        ->assertJsonPath('data.project.status', 'Planning')
        ->assertJsonPath('data.project.priority', 'High');

    $this->assertDatabaseHas('projects', [
        'client_name' => 'Acme Corp',
        'project_name' => 'Website Redesign',
    ]);
});

it('shows a project', function (): void {
    Sanctum::actingAs(User::factory()->create());
    $project = Project::factory()->create([
        'client_name' => 'Show Client',
    ]);

    $this->getJson("/api/v1/projects/{$project->id}")
        ->assertOk()
        ->assertJsonPath('data.project.id', $project->id)
        ->assertJsonPath('data.project.client_name', 'Show Client');
});

it('updates a project', function (): void {
    Sanctum::actingAs(User::factory()->create());
    $project = Project::factory()->create([
        'project_name' => 'Old Name',
    ]);

    $this->putJson("/api/v1/projects/{$project->id}", [
        'project_name' => 'New Name',
        'status' => ProjectStatus::InProgress->value,
    ])
        ->assertOk()
        ->assertJsonPath('data.project.project_name', 'New Name')
        ->assertJsonPath('data.project.status', 'In Progress');

    $this->assertDatabaseHas('projects', [
        'id' => $project->id,
        'project_name' => 'New Name',
        'status' => 'In Progress',
    ]);
});

it('deletes a project', function (): void {
    Sanctum::actingAs(User::factory()->create());
    $project = Project::factory()->create();

    $this->deleteJson("/api/v1/projects/{$project->id}")
        ->assertOk()
        ->assertJsonPath('message', 'Project deleted.');

    $this->assertDatabaseMissing('projects', [
        'id' => $project->id,
    ]);
});

it('requires client_name and project_name when creating', function (): void {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson('/api/v1/projects', [
        'status' => ProjectStatus::Planning->value,
        'priority' => ProjectPriority::Low->value,
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['client_name', 'project_name']);
});

it('rejects invalid status and priority when creating', function (): void {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson('/api/v1/projects', [
        'client_name' => 'Acme',
        'project_name' => 'Test',
        'status' => 'Invalid Status',
        'priority' => 'Urgent',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['status', 'priority']);
});

it('rejects due_date earlier than start_date', function (): void {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson('/api/v1/projects', [
        'client_name' => 'Acme',
        'project_name' => 'Test',
        'status' => ProjectStatus::Planning->value,
        'priority' => ProjectPriority::Medium->value,
        'start_date' => '2026-06-01',
        'due_date' => '2026-01-01',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['due_date'])
        ->assertJsonPath('errors.due_date.0', 'The due date cannot be earlier than the start date.');
});

it('searches projects by client name, project name, and description', function (): void {
    Sanctum::actingAs(User::factory()->create());

    Project::factory()->create([
        'client_name' => 'Acme Corp',
        'project_name' => 'Alpha',
        'description' => 'Unrelated',
    ]);
    Project::factory()->create([
        'client_name' => 'Beta LLC',
        'project_name' => 'Acme Migration',
        'description' => 'Unrelated',
    ]);
    Project::factory()->create([
        'client_name' => 'Gamma Inc',
        'project_name' => 'Gamma',
        'description' => 'Includes acme in notes',
    ]);
    Project::factory()->create([
        'client_name' => 'Other',
        'project_name' => 'Other',
        'description' => 'Nothing here',
    ]);

    $this->getJson('/api/v1/projects?search=acme')
        ->assertOk()
        ->assertJsonCount(3, 'data.projects');
});

it('filters projects by status', function (): void {
    Sanctum::actingAs(User::factory()->create());

    Project::factory()->create(['status' => ProjectStatus::Planning]);
    Project::factory()->create(['status' => ProjectStatus::InProgress]);
    Project::factory()->create(['status' => ProjectStatus::InProgress]);

    $this->getJson('/api/v1/projects?status=In%20Progress')
        ->assertOk()
        ->assertJsonCount(2, 'data.projects')
        ->assertJsonPath('data.projects.0.status', 'In Progress')
        ->assertJsonPath('data.projects.1.status', 'In Progress');
});

it('filters projects by priority', function (): void {
    Sanctum::actingAs(User::factory()->create());

    Project::factory()->create(['priority' => ProjectPriority::Low]);
    Project::factory()->create(['priority' => ProjectPriority::High]);
    Project::factory()->create(['priority' => ProjectPriority::High]);

    $this->getJson('/api/v1/projects?priority=High')
        ->assertOk()
        ->assertJsonCount(2, 'data.projects');
});

it('sorts projects by project_name descending', function (): void {
    Sanctum::actingAs(User::factory()->create());

    Project::factory()->create(['project_name' => 'Alpha']);
    Project::factory()->create(['project_name' => 'Charlie']);
    Project::factory()->create(['project_name' => 'Bravo']);

    $response = $this->getJson('/api/v1/projects?sort_by=project_name&sort_dir=desc')
        ->assertOk();

    expect($response->json('data.projects.0.project_name'))->toBe('Charlie')
        ->and($response->json('data.projects.1.project_name'))->toBe('Bravo')
        ->and($response->json('data.projects.2.project_name'))->toBe('Alpha');
});

it('combines search and status filter', function (): void {
    Sanctum::actingAs(User::factory()->create());

    Project::factory()->create([
        'client_name' => 'Acme Corp',
        'status' => ProjectStatus::Planning,
    ]);
    Project::factory()->create([
        'client_name' => 'Acme Corp',
        'status' => ProjectStatus::Completed,
    ]);
    Project::factory()->create([
        'client_name' => 'Other',
        'status' => ProjectStatus::Planning,
    ]);

    $this->getJson('/api/v1/projects?search=Acme&status=Planning')
        ->assertOk()
        ->assertJsonCount(1, 'data.projects')
        ->assertJsonPath('data.projects.0.client_name', 'Acme Corp')
        ->assertJsonPath('data.projects.0.status', 'Planning');
});

it('rejects invalid list query params', function (): void {
    Sanctum::actingAs(User::factory()->create());

    $this->getJson('/api/v1/projects?sort_by=hack&status=Nope')
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['sort_by', 'status']);
});
