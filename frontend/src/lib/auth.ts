import { betterAuth } from 'better-auth'
import { laravelCredentials } from '@/lib/auth/laravel-credentials'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  session: {
    additionalFields: {
      apiToken: {
        type: 'string',
        required: false,
        input: false,
      },
    },
  },
  plugins: [laravelCredentials()],
})

export type Session = typeof auth.$Infer.Session
