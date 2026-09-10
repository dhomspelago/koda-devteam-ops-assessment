export type User = {
  id: number
  name: string
  email: string
  created_at: string | null
  updated_at: string | null
}

export type LaravelUser = {
  id: number | string
  name: string
  email: string
  created_at?: string | null
  updated_at?: string | null
}

export type LaravelUserEnvelope = LaravelUser | { data: LaravelUser }

export type LaravelLoginPayload = {
  message?: string
  data?: {
    user?: LaravelUserEnvelope
    token?: string
    token_type?: string
  }
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginData = {
  user: User
  token: string
  token_type: string
}

export type LoginResponse = {
  message: string
  data: LoginData
}

export type SignInLaravelResult = {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export type LoginErrorRecord = {
  message?: string
  error?: { message?: string }
  status?: number
}
