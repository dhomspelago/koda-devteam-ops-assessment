import { useEffect, useState } from 'react'

type HealthResponse = {
  status: string
  service: string
}

type HealthState =
  | { status: 'loading' }
  | { status: 'ok'; data: HealthResponse }
  | { status: 'error'; message: string }

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '/api/v1'

function App() {
  const [health, setHealth] = useState<HealthState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function checkHealth() {
      try {
        const response = await fetch(`${apiBaseUrl}/health`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`API responded with ${response.status}`)
        }

        const data = (await response.json()) as HealthResponse
        setHealth({ status: 'ok', data })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'Unable to reach the API'

        setHealth({ status: 'error', message })
      }
    }

    void checkHealth()

    return () => controller.abort()
  }, [])

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Koda
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Devteam Ops Assessment
        </h1>
        <p className="text-lg text-slate-600">
          React SPA talking to the Laravel API. This page only checks the health
          endpoint so the monolith wiring is verified.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          API health
        </h2>

        {health.status === 'loading' && (
          <p className="mt-3 text-slate-700">Checking {apiBaseUrl}/health…</p>
        )}

        {health.status === 'ok' && (
          <div className="mt-3 space-y-1">
            <p className="text-lg font-medium text-emerald-700">API reachable</p>
            <p className="text-sm text-slate-600">
              status: {health.data.status} · service: {health.data.service}
            </p>
          </div>
        )}

        {health.status === 'error' && (
          <div className="mt-3 space-y-1">
            <p className="text-lg font-medium text-rose-700">API unreachable</p>
            <p className="text-sm text-slate-600">{health.message}</p>
            <p className="text-sm text-slate-500">
              Start the Laravel API with{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5">
                php artisan serve
              </code>{' '}
              in <code className="rounded bg-slate-100 px-1.5 py-0.5">backend/</code>
              .
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
