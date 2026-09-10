import type { LaravelUser, LaravelUserEnvelope } from '@/types/auth'

export function getBackendUrl(): string {
  return process.env.BACKEND_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000'
}

export function unwrapLaravelUser(
  user: LaravelUserEnvelope | undefined,
): LaravelUser | null {
  if (!user) {
    return null
  }

  if ('data' in user && user.data && typeof user.data === 'object') {
    return user.data
  }

  return user as LaravelUser
}
