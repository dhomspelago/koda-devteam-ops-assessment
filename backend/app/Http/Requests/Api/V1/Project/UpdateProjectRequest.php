<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\V1\Project;

use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

final class UpdateProjectRequest extends FormRequest
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
            'client_name' => ['sometimes', 'required', 'string', 'max:255'],
            'project_name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'required', Rule::enum(ProjectStatus::class)],
            'priority' => ['sometimes', 'required', Rule::enum(ProjectPriority::class)],
            'start_date' => ['sometimes', 'nullable', 'date'],
            'due_date' => ['sometimes', 'nullable', 'date', 'after_or_equal:start_date'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'due_date.after_or_equal' => 'The due date cannot be earlier than the start date.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var Project|null $project */
            $project = $this->route('project');

            if ($project === null) {
                return;
            }

            $startDate = $this->input('start_date', $project->start_date?->format('Y-m-d'));
            $dueDate = $this->input('due_date', $project->due_date?->format('Y-m-d'));

            if ($startDate === null || $dueDate === null) {
                return;
            }

            if ($dueDate < $startDate) {
                $validator->errors()->add(
                    'due_date',
                    'The due date cannot be earlier than the start date.'
                );
            }
        });
    }
}