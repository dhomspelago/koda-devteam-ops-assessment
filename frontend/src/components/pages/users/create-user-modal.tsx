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
import { useCreateUser } from '@/hooks/api/users/use-create-user'
import {
  PostUserSchema,
  type PostUserSchemaType,
} from '@/schemas/user.schema'

type CreateUserModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const emptyForm: PostUserSchemaType = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
  const createUser = useCreateUser()
  const [form, setForm] = useState<PostUserSchemaType>(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PostUserSchemaType, string>>
  >({})

  useEffect(() => {
    if (!open) {
      setForm(emptyForm)
      setFieldErrors({})
      createUser.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when dialog closes
  }, [open])

  function updateField<K extends keyof PostUserSchemaType>(
    key: K,
    value: PostUserSchemaType[K],
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

    const result = PostUserSchema.safeParse(form)
    if (!result.success) {
      const nextErrors: Partial<Record<keyof PostUserSchemaType, string>> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (
          typeof key === 'string' &&
          key in emptyForm &&
          !nextErrors[key as keyof PostUserSchemaType]
        ) {
          nextErrors[key as keyof PostUserSchemaType] = issue.message
        }
      }
      setFieldErrors(nextErrors)
      return
    }

    createUser.mutate(result.data, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>
            Create a new user account with name, email, and password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field data-invalid={!!fieldErrors.name || undefined}>
              <FieldLabel htmlFor="create-user-name">Name</FieldLabel>
              <Input
                id="create-user-name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                disabled={createUser.isPending}
                aria-invalid={!!fieldErrors.name}
              />
              <FieldError>{fieldErrors.name}</FieldError>
            </Field>

            <Field data-invalid={!!fieldErrors.email || undefined}>
              <FieldLabel htmlFor="create-user-email">Email</FieldLabel>
              <Input
                id="create-user-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                disabled={createUser.isPending}
                aria-invalid={!!fieldErrors.email}
              />
              <FieldError>{fieldErrors.email}</FieldError>
            </Field>

            <Field data-invalid={!!fieldErrors.password || undefined}>
              <FieldLabel htmlFor="create-user-password">Password</FieldLabel>
              <Input
                id="create-user-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(event) =>
                  updateField('password', event.target.value)
                }
                disabled={createUser.isPending}
                aria-invalid={!!fieldErrors.password}
              />
              <FieldError>{fieldErrors.password}</FieldError>
            </Field>

            <Field
              data-invalid={!!fieldErrors.password_confirmation || undefined}
            >
              <FieldLabel htmlFor="create-user-password-confirmation">
                Confirm password
              </FieldLabel>
              <Input
                id="create-user-password-confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                value={form.password_confirmation}
                onChange={(event) =>
                  updateField('password_confirmation', event.target.value)
                }
                disabled={createUser.isPending}
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
              disabled={createUser.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? 'Creating…' : 'Create user'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
