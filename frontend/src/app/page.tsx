'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthClient } from '@/providers/auth-provider'

export default function HomePage() {
  const router = useRouter()
  const authClient = useAuthClient()
  const { data: session, isPending } = authClient.useSession()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  if (isPending) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6">
        <p className="text-muted-foreground">Loading session…</p>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Koda
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Welcome{session?.user?.name ? `, ${session.user.name}` : ''}
        </h1>
        <p className="text-muted-foreground">
          Signed in via Better Auth. The Laravel API token is stored on the
          session cookie only.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <p>Email: {session?.user?.email ?? '—'}</p>
        <p className="mt-1">
          API token present:{' '}
          {session?.session &&
          'apiToken' in session.session &&
          session.session.apiToken
            ? 'yes'
            : 'no'}
        </p>
      </div>

      <Button type="button" variant="outline" onClick={() => void handleSignOut()}>
        Sign out
      </Button>
    </main>
  )
}
