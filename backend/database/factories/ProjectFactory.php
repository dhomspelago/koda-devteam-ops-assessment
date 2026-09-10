<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->optional()->date();

        return [
            'client_name' => fake()->company(),
            'project_name' => fake()->sentence(3),
            'description' => fake()->optional()->paragraph(),
            'status' => ProjectStatus::Planning,
            'priority' => ProjectPriority::Medium,
            'start_date' => $startDate,
            'due_date' => $startDate !== null
                ? fake()->optional()->dateTimeBetween($startDate, '+1 year')?->format('Y-m-d')
                : fake()->optional()->date(),
        ];
    }
}
