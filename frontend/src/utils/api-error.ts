import { isAxiosError } from 'axios'

type ApiErrorPayload = {
  message?: string
  errors?: Record<string, string[] | string>
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined

    if (payload?.errors) {
      const first = Object.values(payload.errors)[0]
      if (Array.isArray(first) && first[0]) {
        return first[0]
      }
      if (typeof first === 'string' && first) {
        return first
      }
    }

    if (payload?.message) {
      return payload.message
    }

    if (error.message) {
      return error.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
