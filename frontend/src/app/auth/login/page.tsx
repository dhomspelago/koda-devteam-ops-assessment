import { LoginForm } from '@/components/auth/login-form'
import { AuthLayout } from '@/layout/auth-layout'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in"
      description="Assessment"
    >
      <LoginForm />
    </AuthLayout>
  )
}
