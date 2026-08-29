import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export function BusinessRoute({ children }: { children: ReactNode }) {
  const { user, loading, identityAvailable } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <main className="page">
        <p className="muted">Checking your business account…</p>
      </main>
    )
  }

  if (user) return children

  const next = encodeURIComponent(`${location.pathname}${location.search}`)

  return (
    <main className="page auth-page">
      <h1>Business dashboard</h1>
      <p className="lede">
        This dashboard opens only after you register as a business. Log in if you already have an
        account.
      </p>
      {!identityAvailable ? (
        <p className="error">Authentication works after you deploy this site to Netlify.</p>
      ) : null}
      <div className="hero-actions">
        <Link className="btn btn-primary" to={`/signup?next=${next}`}>
          Register as a business
        </Link>
        <Link className="btn btn-ghost" to={`/login?next=${next}`}>
          Log in
        </Link>
      </div>
    </main>
  )
}
