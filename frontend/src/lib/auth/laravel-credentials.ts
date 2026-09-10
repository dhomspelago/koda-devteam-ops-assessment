import type { BetterAuthPlugin } from 'better-auth'
import { APIError, createAuthEndpoint } from 'better-auth/api'
import { setSessionCookie } from 'better-auth/cookies'
import { parseUserOutput } from 'better-auth/db'
import * as z from 'zod'
import type { LaravelLoginPayload } from '@/types/auth'
import { getBackendUrl, unwrapLaravelUser } from '@/utils/laravel-auth'

export function laravelCredentials(): BetterAuthPlugin {
  return {
    id: 'laravel-credentials',
    endpoints: {
      signInLaravel: createAuthEndpoint(
        '/login',
        {
          method: 'POST',
          body: z.object({
            email: z.string().email(),
            password: z.string().min(1),
          }),
        },
        async (ctx) => {
          const backendUrl = getBackendUrl()

          const response = await fetch(`${backendUrl}/api/v1/login`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: ctx.body.email,
              password: ctx.body.password,
            }),
          })

          const payload = (await response.json().catch(() => null)) as
            | LaravelLoginPayload
            | null

          if (!response.ok) {
            throw new APIError(
              response.status === 422 ? 'BAD_REQUEST' : 'UNAUTHORIZED',
              {
                message:
                  payload?.message ??
                  (response.status === 422
                    ? 'Validation failed.'
                    : 'Invalid credentials.'),
              },
            )
          }

          const laravelUser = unwrapLaravelUser(payload?.data?.user)
          const apiToken = payload?.data?.token

          if (!laravelUser?.email || !apiToken) {
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: 'Unexpected login response from backend.',
            })
          }

          const userId = String(laravelUser.id)
          const existing = await ctx.context.internalAdapter.findUserByEmail(
            laravelUser.email.toLowerCase(),
          )

          const user =
            existing?.user ??
            (await ctx.context.internalAdapter.createUser(
              {
                id: userId,
                email: laravelUser.email.toLowerCase(),
                name: laravelUser.name,
                emailVerified: true,
              },
              { method: 'laravel-credentials' },
            ))

          if (!user) {
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: 'Failed to create session user.',
            })
          }

          if (existing?.user) {
            await ctx.context.internalAdapter.updateUser(user.id, {
              name: laravelUser.name,
              email: laravelUser.email.toLowerCase(),
            })
          }

          const session = await ctx.context.internalAdapter.createSession(
            user.id,
            false,
            { apiToken },
          )

          if (!session) {
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: 'Failed to create session.',
            })
          }

          const sessionUser = existing?.user
            ? {
                ...user,
                name: laravelUser.name,
                email: laravelUser.email.toLowerCase(),
              }
            : user

          await setSessionCookie(ctx, {
            session,
            user: sessionUser,
          })

          return ctx.json({
            token: session.token,
            user: parseUserOutput(ctx.context.options, sessionUser),
          })
        },
      ),
    },
  } satisfies BetterAuthPlugin
}
