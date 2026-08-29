import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, identityAvailable } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <main className="page">
        <p className="muted">Checking your session…</p>
      </main>
    )
  }

  if (!identityAvailable) {
    return (
      <main className="page">
        <div className="panel stack">
          <h1>Sign-in is not available locally</h1>
          <p>
            Netlify Identity only works on a deployed Netlify site. Deploy a preview, turn on
            Autoconfirm, then come back to list surplus or send an inquiry.
          </p>
        </div>
      </main>
    )
  }

  if (!user) {
    const next = `${location.pathname}${location.search}`
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }

  return children
}
