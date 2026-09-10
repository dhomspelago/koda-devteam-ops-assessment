import type { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
  title?: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Koda
          </p>
          {title ? (
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div>{children}</div>
      </div>
    </main>
  )
}
