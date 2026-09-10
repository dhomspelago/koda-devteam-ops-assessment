<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\V1\Project;

use App\DTOs\Project\ProjectIndexQuery;
use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class IndexProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'nullable', Rule::enum(ProjectStatus::class)],
            'priority' => ['sometimes', 'nullable', Rule::enum(ProjectPriority::class)],
            'sort_by' => ['sometimes', 'nullable', 'string', Rule::in(ProjectIndexQuery::SORTABLE)],
            'sort_dir' => ['sometimes', 'nullable', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'nullable', 'integer', 'min:1'],
        ];
    }
}
