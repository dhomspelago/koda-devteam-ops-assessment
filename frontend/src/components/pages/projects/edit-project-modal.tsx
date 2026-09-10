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
import { useUpdateProject } from '@/hooks/api/projects/use-update-project'
import {
  PatchProjectSchema,
  type PatchProjectSchemaType,
} from '@/schemas/project.schema'
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  type Project,
  type ProjectPriority,
  type ProjectStatus,
} from '@/types/project'

type EditProjectModalProps = {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type EditFormState = {
  client_name: string
  project_name: string
  description: string
  status: ProjectStatus | ''
  priority: ProjectPriority | ''
  start_date: string
  due_date: string
}

const emptyForm: EditFormState = {
  client_name: '',
  project_name: '',
  description: '',
  status: '',
  priority: '',
  start_date: '',
  due_date: '',
}

export function EditProjectModal({
  project,
  open,
  onOpenChange,
}: EditProjectModalProps) {
  const updateProject = useUpdateProject()
  const [form, setForm] = useState<EditFormState>(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof EditFormState, string>>
  >({})

  useEffect(() => {
    if (open && project) {
      setForm({
        client_name: project.client_name,
        project_name: project.project_name,
        description: project.description ?? '',
        status: project.status,
        priority: project.priority,
        start_date: project.start_date ?? '',
        due_date: project.due_date ?? '',
      })
      setFieldErrors({})
      updateProject.reset()
      return
    }

    if (!open) {
      setForm(emptyForm)
      setFieldErrors({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when dialog opens with project
  }, [open, project])

  function updateField<K extends keyof EditFormState>(
    key: K,
    value: EditFormState[K],
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
    if (!project) {
      return
    }

    const result = PatchProjectSchema.safeParse(form)
    if (!result.success) {
      const nextErrors: Partial<Record<keyof EditFormState, string>> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (
          typeof key === 'string' &&
          key in emptyForm &&
          !nextErrors[key as keyof EditFormState]
        ) {
          nextErrors[key as keyof EditFormState] = issue.message
        }
      }
      setFieldErrors(nextErrors)
      return
    }

    updateProject.mutate(
      {
        id: project.id,
        payload: result.data as PatchProjectSchemaType,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>
            Update project details, status, priority, and dates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field data-invalid={!!fieldErrors.client_name || undefined}>
              <FieldLabel htmlFor="edit-project-client">Client name</FieldLabel>
              <Input
                id="edit-project-client"
                name="client_name"
                value={form.client_name}
                onChange={(event) =>
                  updateField('client_name', event.target.value)
                }
                disabled={updateProject.isPending}
                aria-invalid={!!fieldErrors.client_name}
              />
              <FieldError>{fieldErrors.client_name}</FieldError>
            </Field>

            <Field data-invalid={!!fieldErrors.project_name || undefined}>
              <FieldLabel htmlFor="edit-project-name">Project name</FieldLabel>
              <Input
                id="edit-project-name"
                name="project_name"
                value={form.project_name}
                onChange={(event) =>
                  updateField('project_name', event.target.value)
                }
                disabled={updateProject.isPending}
                aria-invalid={!!fieldErrors.project_name}
              />
              <FieldError>{fieldErrors.project_name}</FieldError>
            </Field>

            <Field data-invalid={!!fieldErrors.description || undefined}>
              <FieldLabel htmlFor="edit-project-description">
                Description
              </FieldLabel>
              <Textarea
                id="edit-project-description"
                name="description"
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                disabled={updateProject.isPending}
                aria-invalid={!!fieldErrors.description}
              />
              <FieldError>{fieldErrors.description}</FieldError>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!fieldErrors.status || undefined}>
                <FieldLabel htmlFor="edit-project-status">Status</FieldLabel>
                <NativeSelect
                  id="edit-project-status"
                  name="status"
                  value={form.status}
                  onChange={(event) =>
                    updateField('status', event.target.value as ProjectStatus)
                  }
                  disabled={updateProject.isPending}
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
                <FieldLabel htmlFor="edit-project-priority">Priority</FieldLabel>
                <NativeSelect
                  id="edit-project-priority"
                  name="priority"
                  value={form.priority}
                  onChange={(event) =>
                    updateField(
                      'priority',
                      event.target.value as ProjectPriority,
                    )
                  }
                  disabled={updateProject.isPending}
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
                <FieldLabel htmlFor="edit-project-start">Start date</FieldLabel>
                <Input
                  id="edit-project-start"
                  name="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(event) =>
                    updateField('start_date', event.target.value)
                  }
                  disabled={updateProject.isPending}
                  aria-invalid={!!fieldErrors.start_date}
                />
                <FieldError>{fieldErrors.start_date}</FieldError>
              </Field>

              <Field data-invalid={!!fieldErrors.due_date || undefined}>
                <FieldLabel htmlFor="edit-project-due">Due date</FieldLabel>
                <Input
                  id="edit-project-due"
                  name="due_date"
                  type="date"
                  value={form.due_date}
                  onChange={(event) =>
                    updateField('due_date', event.target.value)
                  }
                  disabled={updateProject.isPending}
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
              disabled={updateProject.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProject.isPending || !project}
            >
              {updateProject.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
