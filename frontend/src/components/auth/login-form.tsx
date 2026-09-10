'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useApi } from '@/providers/api-provider'
import { useAuthClient } from '@/providers/auth-provider'
import { getLoginErrorMessage } from '@/utils/login-error'
import { signInWithLaravel } from '@/utils/sign-in-laravel'

export function LoginForm() {
  const router = useRouter()
  const { authApi } = useApi()
  const authClient = useAuthClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      signInWithLaravel(authApi, credentials),
    onSuccess: async () => {
      await authClient.getSession()
      router.push('/')
      router.refresh()
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    mutation.mutate({ email, password })
  }

  const errorMessage = mutation.error
    ? getLoginErrorMessage(mutation.error)
    : null

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={mutation.isPending}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={mutation.isPending}
          />
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
