'use client'

import { useEffect, useMemo, useState } from 'react'

export default function DebugEnv() {
  const apiBaseUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : 'https://api.william-malone.com/api'
  }, [])

  const [health, setHealth] = useState<{ ok: boolean; status?: number; body?: any; error?: string } | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/health`)
        const text = await res.text()
        let body: any = text
        try {
          body = JSON.parse(text)
        } catch {
          // keep as text
        }

        if (!cancelled) {
          setHealth({ ok: res.ok, status: res.status, body })
        }
      } catch (e: any) {
        if (!cancelled) {
          setHealth({ ok: false, error: e?.message || String(e) })
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [apiBaseUrl])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Debug</h1>
      <div className="space-y-2">
        <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'undefined'}</p>
        <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'undefined'}</p>
        <p><strong>Current API Base:</strong> {apiBaseUrl}</p>
        <p><strong>API Health:</strong> {health ? (health.ok ? `OK (${health.status})` : `FAIL (${health.status || 'no status'})`) : 'Checking...'}</p>
        {health?.error ? <pre className="mt-2 whitespace-pre-wrap text-sm">{health.error}</pre> : null}
        {health?.body ? <pre className="mt-2 whitespace-pre-wrap text-sm">{JSON.stringify(health.body, null, 2)}</pre> : null}
      </div>
    </div>
  )
}
