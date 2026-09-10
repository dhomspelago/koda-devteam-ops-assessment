'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateProject } from '@/hooks/api/projects/use-create-project'
import {
  PostProjectSchema,
  type PostProjectSchemaType,
} from '@/schemas/project.schema'
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  type ProjectPriority,
  type ProjectStatus,
} from '@/types/project'

type CreateProjectModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type CreateFormState = {
  client_name: string
  project_name: string
  description: string
  status: ProjectStatus | ''
  priority: ProjectPriority | ''
  start_date: string
  due_date: string
}

const emptyForm: CreateFormState = {
  client_name: '',
  project_name: '',
  description: '',
  status: 'Planning',
  priority: 'Medium',
  start_date: '',
  due_date: '',
}

export function CreateProjectModal({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  const createProject = useCreateProject()
  const [form, setForm] = useState<CreateFormState>(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CreateFormState, string>>
  >({})

  useEffect(() => {
    if (!open) {
      setForm(emptyForm)
      setFieldErrors({})
      createProject.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when dialog closes
  }, [open])

  function updateField<K extends keyof CreateFormState>(
    key: K,
    value: CreateFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => {
      if (!prev[key]) {
        return prev
      }
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = PostProjectSchema.safeParse(form)
    if (!result.success) {
      const nextErrors: Partial<Record<keyof CreateFormState, string>> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (
          typeof key === 'string' &&
          key in emptyForm &&
          !nextErrors[key as keyof CreateFormState]
        ) {
          nextErrors[key as keyof CreateFormState] = issue.message
        }
      }
      setFieldErrors(nextErrors)
      return
    }

    createProject.mutate(result.data as PostProjectSchemaType, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add project</DialogTitle>
          <DialogDescription>
            Create a new project with client details, status, and dates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field data-invalid={!!fieldErrors.client_name || undefined}>
              <FieldLabel htmlFor="create-project-client">Client name</FieldLabel>
              <Input
                id="create-project-client"
                name="client_name"
                value={form.client_name}
                onChange={(event) =>
                  updateField('client_name', event.target.value)
                }
                disabled={createProject.isPending}
                aria-invalid={!!fieldErrors.client_name}
              />
              <FieldError>{fieldErrors.client_name}</FieldError>
            </Field>

            <Field data-invalid={!!fieldErrors.project_name || undefined}>
              <FieldLabel htmlFor="create-project-name">Project name</FieldLabel>
              <Input
                id="create-project-name"
                name="project_name"
                value={form.project_name}
                onChange={(event) =>
                  updateField('project_name', event.target.value)
                }
                disabled={createProject.isPending}
                aria-invalid={!!fieldErrors.project_name}
              />
              <FieldError>{fieldErrors.project_name}</FieldError>
            </Field>

            <Field data-invalid={!!fieldErrors.description || undefined}>
              <FieldLabel htmlFor="create-project-description">
                Description
              </FieldLabel>
              <Textarea
                id="create-project-description"
                name="description"
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                disabled={createProject.isPending}
                aria-invalid={!!fieldErrors.description}
              />
              <FieldError>{fieldErrors.description}</FieldError>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!fieldErrors.status || undefined}>
                <FieldLabel htmlFor="create-project-status">Status</FieldLabel>
                <NativeSelect
                  id="create-project-status"
                  name="status"
                  value={form.status}
                  onChange={(event) =>
                    updateField('status', event.target.value as ProjectStatus)
                  }
                  disabled={createProject.isPending}
                  aria-invalid={!!fieldErrors.status}
                  className="w-full"
                >
                  {PROJECT_STATUSES.map((status) => (
                    <NativeSelectOption key={status} value={status}>
                      {status}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <FieldError>{fieldErrors.status}</FieldError>
              </Field>

              <Field data-invalid={!!fieldErrors.priority || undefined}>
                <FieldLabel htmlFor="create-project-priority">
                  Priority
                </FieldLabel>
                <NativeSelect
                  id="create-project-priority"
                  name="priority"
                  value={form.priority}
                  onChange={(event) =>
                    updateField(
                      'priority',
                      event.target.value as ProjectPriority,
                    )
                  }
                  disabled={createProject.isPending}
                  aria-invalid={!!fieldErrors.priority}
                  className="w-full"
                >
                  {PROJECT_PRIORITIES.map((priority) => (
                    <NativeSelectOption key={priority} value={priority}>
                      {priority}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <FieldError>{fieldErrors.priority}</FieldError>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!fieldErrors.start_date || undefined}>
                <FieldLabel htmlFor="create-project-start">Start date</FieldLabel>
                <Input
                  id="create-project-start"
                  name="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(event) =>
                    updateField('start_date', event.target.value)
                  }
                  disabled={createProject.isPending}
                  aria-invalid={!!fieldErrors.start_date}
                />
                <FieldError>{fieldErrors.start_date}</FieldError>
              </Field>

              <Field data-invalid={!!fieldErrors.due_date || undefined}>
                <FieldLabel htmlFor="create-project-due">Due date</FieldLabel>
                <Input
                  id="create-project-due"
                  name="due_date"
                  type="date"
                  value={form.due_date}
                  onChange={(event) =>
                    updateField('due_date', event.target.value)
                  }
                  disabled={createProject.isPending}
                  aria-invalid={!!fieldErrors.due_date}
                />
                <FieldError>{fieldErrors.due_date}</FieldError>
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createProject.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? 'Creating…' : 'Create project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
