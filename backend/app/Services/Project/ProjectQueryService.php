<?php

declare(strict_types=1);

namespace App\Services\Project;

use App\DTOs\Project\ProjectIndexQuery;
use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final readonly class ProjectQueryService
{
    /**
     * @return LengthAwarePaginator<int, Project>
     */
    public function paginate(ProjectIndexQuery $query): LengthAwarePaginator
    {
        return Project::query()
            ->when(
                $query->search,
                fn (Builder $builder, string $search): Builder => $builder->search($search)
            )
            ->when(
                $query->status,
                fn (Builder $builder, string $status): Builder => $builder->status($status)
            )
            ->when(
                $query->priority,
                fn (Builder $builder, string $priority): Builder => $builder->priority($priority)
            )
            ->orderBy($query->sortBy, $query->sortDir)
            ->paginate($query->perPage);
    }
}
