<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'client_name',
    'project_name',
    'description',
    'status',
    'priority',
    'start_date',
    'due_date',
])]
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ProjectStatus::class,
            'priority' => ProjectPriority::class,
            'start_date' => 'date',
            'due_date' => 'date',
        ];
    }

    /**
     * @param  Builder<Project>  $query
     * @return Builder<Project>
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        $term = '%'.$search.'%';

        return $query->where(function (Builder $builder) use ($term): void {
            $builder->where('client_name', 'like', $term)
                ->orWhere('project_name', 'like', $term)
                ->orWhere('description', 'like', $term);
        });
    }

    /**
     * @param  Builder<Project>  $query
     * @return Builder<Project>
     */
    public function scopeStatus(Builder $query, ProjectStatus|string $status): Builder
    {
        return $query->where('status', $status instanceof ProjectStatus ? $status->value : $status);
    }

    /**
     * @param  Builder<Project>  $query
     * @return Builder<Project>
     */
    public function scopePriority(Builder $query, ProjectPriority|string $priority): Builder
    {
        return $query->where('priority', $priority instanceof ProjectPriority ? $priority->value : $priority);
    }
}
