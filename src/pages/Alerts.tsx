import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMatchAlerts } from '../lib/api'
import { formatDate } from '../lib/format'
import type { MatchAlert } from '../types'

function alertCopy(alert: MatchAlert) {
  if (alert.kind === 'surplus_for_wanted') {
    return `New surplus “${alert.listing.title}” matches your need “${alert.wanted.title}”.`
  }
  return `A buyer posted “${alert.wanted.title}”, which matches your surplus “${alert.listing.title}”.`
}

export function Alerts() {
  const [alerts, setAlerts] = useState<MatchAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    void fetchMatchAlerts()
      .then(setAlerts)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Could not load match alerts.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="page">
      <h1>Match alerts</h1>
      <p className="lede">
        When surplus and a wanted post share the same material type and city, both businesses get an
        alert here. Email/SMS alerts need a deployed Netlify site.
      </p>
      {loading ? <p className="muted">Loading alerts…</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {!loading && alerts.length === 0 ? (
        <p className="empty">No matches yet. Post surplus or a wanted listing to start matching.</p>
      ) : null}
      <div className="stack">
        {alerts.map((alert) => (
          <article className="card inquiry-card" key={alert.id}>
            <p>{alertCopy(alert)}</p>
            <p className="muted">{formatDate(alert.createdAt)}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to={`/listings/${alert.listing.id}`}>
                View surplus
              </Link>
              <Link className="btn btn-ghost" to={`/wanted/${alert.wanted.id}`}>
                View wanted
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
