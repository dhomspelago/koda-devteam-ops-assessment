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
import { useUpdateUser } from '@/hooks/api/users/use-update-user'
import {
  PatchUserSchema,
  type PatchUserSchemaType,
} from '@/schemas/user.schema'
import type { User } from '@/types/auth'

type EditUserModalProps = {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type EditFormState = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

const emptyForm: EditFormState = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
}

export function EditUserModal({
  user,
  open,
  onOpenChange,
}: EditUserModalProps) {
  const updateUser = useUpdateUser()
  const [form, setForm] = useState<EditFormState>(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof EditFormState, string>>
  >({})

  useEffect(() => {
    if (open && user) {
      setForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
      })
      setFieldErrors({})
      updateUser.reset()
      return
    }

    if (!open) {
      setForm(emptyForm)
      setFieldErrors({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when dialog opens with user
  }, [open, user])

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
    if (!user) {
      return
    }

    const result = PatchUserSchema.safeParse(form)
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

    const data: PatchUserSchemaType = result.data
    const payload: {
      name: string
      email: string
      password?: string
      password_confirmation?: string
    } = {
      name: data.name,
      email: data.email,
    }

    if (data.password?.trim()) {
      payload.password = data.password
      payload.password_confirmation = data.password_confirmation
    }

    updateUser.mutate(
      { id: user.id, payload },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update user details. Leave password blank to keep the current one.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field data-invalid={!!fieldErrors.name || undefined}>
              <FieldLabel htmlFor="edit-user-name">Name</FieldLabel>
              <Input
                id="edit-user-name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                disabled={updateUser.isPending}
                aria-invalid={!!fieldErrors.name}
              />
              <FieldError>{fieldErrors.name}</FieldError>
            </Field>

            <Field data-invalid={!!fieldErrors.email || undefined}>
              <FieldLabel htmlFor="edit-user-email">Email</FieldLabel>
              <Input
                id="edit-user-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                disabled={updateUser.isPending}
                aria-invalid={!!fieldErrors.email}
              />
              <FieldError>{fieldErrors.email}</FieldError>
            </Field>

            <Field data-invalid={!!fieldErrors.password || undefined}>
              <FieldLabel htmlFor="edit-user-password">
                Password (optional)
              </FieldLabel>
              <Input
                id="edit-user-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(event) =>
                  updateField('password', event.target.value)
                }
                disabled={updateUser.isPending}
                aria-invalid={!!fieldErrors.password}
              />
              <FieldError>{fieldErrors.password}</FieldError>
            </Field>

            <Field
              data-invalid={!!fieldErrors.password_confirmation || undefined}
            >
              <FieldLabel htmlFor="edit-user-password-confirmation">
                Confirm password
              </FieldLabel>
              <Input
                id="edit-user-password-confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                value={form.password_confirmation}
                onChange={(event) =>
                  updateField('password_confirmation', event.target.value)
                }
                disabled={updateUser.isPending}
                aria-invalid={!!fieldErrors.password_confirmation}
              />
              <FieldError>{fieldErrors.password_confirmation}</FieldError>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateUser.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateUser.isPending || !user}>
              {updateUser.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
