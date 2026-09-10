<?php

declare(strict_types=1);

namespace App\DTOs\Project;

final readonly class ProjectIndexQuery
{
    public const SORTABLE = [
        'id',
        'client_name',
        'project_name',
        'status',
        'priority',
        'start_date',
        'due_date',
        'created_at',
    ];

    public function __construct(
        public ?string $search = null,
        public ?string $status = null,
        public ?string $priority = null,
        public string $sortBy = 'id',
        public string $sortDir = 'asc',
        public int $perPage = 15,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromValidated(array $data): self
    {
        $sortBy = $data['sort_by'] ?? 'id';

        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'id';
        }

        return new self(
            search: isset($data['search']) && $data['search'] !== '' ? (string) $data['search'] : null,
            status: isset($data['status']) && $data['status'] !== '' ? (string) $data['status'] : null,
            priority: isset($data['priority']) && $data['priority'] !== '' ? (string) $data['priority'] : null,
            sortBy: $sortBy,
            sortDir: ($data['sort_dir'] ?? 'asc') === 'desc' ? 'desc' : 'asc',
            perPage: (int) ($data['per_page'] ?? 15),
        );
    }
}
