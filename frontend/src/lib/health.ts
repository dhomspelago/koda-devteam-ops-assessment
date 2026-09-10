import { api } from '@/lib/api'

export type HealthResponse = {
  status: string
  service: string
}

export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await api.get<HealthResponse>('/health')

  return data
}
