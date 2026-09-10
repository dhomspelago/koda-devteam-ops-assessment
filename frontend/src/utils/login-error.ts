import { isAxiosError } from 'axios'
import type { LoginErrorRecord } from '@/types/auth'

export function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const payload = error.response?.data as LoginErrorRecord | undefined

    if (payload?.error?.message) {
      return payload.error.message
    }

    if (payload?.message) {
      return payload.message
    }

    if (error.message) {
      return error.message
    }
  }

  if (error && typeof error === 'object') {
    const record = error as LoginErrorRecord

    if (record.error?.message) {
      return record.error.message
    }

    if (record.message) {
      return record.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Unable to sign in. Please try again.'
}
