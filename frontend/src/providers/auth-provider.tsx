'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { authClient } from '@/lib/auth-client'

const AuthClientContext = createContext(authClient)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthClientContext.Provider value={authClient}>
      {children}
    </AuthClientContext.Provider>
  )
}

export function useAuthClient() {
  return useContext(AuthClientContext)
}
