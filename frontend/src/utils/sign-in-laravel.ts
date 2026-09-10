import type { AxiosInstance } from 'axios'
import type { LoginCredentials, SignInLaravelResult } from '@/types/auth'

export async function signInWithLaravel(
  authApi: AxiosInstance,
  credentials: LoginCredentials,
): Promise<SignInLaravelResult> {
  const { data } = await authApi.post<SignInLaravelResult>(
    '/sign-in/laravel',
    credentials,
  )

  return data
}
