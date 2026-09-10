import axios, { type AxiosInstance } from 'axios'
import { authClient } from '@/lib/auth-client'

/** Laravel JSON API client (`/api/v1`). */
export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  const { data } = await authClient.getSession()
  const apiToken =
    data?.session && typeof data.session === 'object' && 'apiToken' in data.session
      ? (data.session.apiToken as string | undefined | null)
      : undefined

  if (apiToken) {
    config.headers.Authorization = `Bearer ${apiToken}`
  }

  return config
})

/** Better Auth route client (`/api/auth`). */
export const authApi: AxiosInstance = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
