'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { type AxiosInstance } from 'axios'
import { api, authApi } from '@/lib/api'

type ApiContextValue = {
  api: AxiosInstance
  authApi: AxiosInstance
}

const ApiContext = createContext<ApiContextValue>({
  api,
  authApi,
})

type ApiProviderProps = {
  children: ReactNode
}

export function ApiProvider({ children }: ApiProviderProps) {
  return (
    <ApiContext.Provider value={{ api, authApi }}>{children}</ApiContext.Provider>
  )
}

export function useApi(): ApiContextValue {
  return useContext(ApiContext)
}
