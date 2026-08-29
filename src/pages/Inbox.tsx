import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSellerInquiries } from '../lib/api'
import { formatDate } from '../lib/format'
import type { SellerInquiry } from '../types'

export function Inbox() {
  const [inquiries, setInquiries] = useState<SellerInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    void fetchSellerInquiries()
      .then(setInquiries)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Could not load inquiries.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="page">
      <h1>Inquiry inbox</h1>
      <p className="lede">Messages from businesses interested in your surplus listings.</p>

      {loading ? <p className="muted">Loading inquiries…</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {!loading && inquiries.length === 0 ? (
        <p className="empty">No inquiries have arrived yet.</p>
      ) : null}

      <div className="stack">
        {inquiries.map((inquiry) => (
          <article className="card inquiry-card" key={inquiry.id}>
            <div className="section-heading">
              <div>
                <h2>
                  <Link to={`/listings/${inquiry.listing.id}`}>{inquiry.listing.title}</Link>
                </h2>
                <p className="muted">
                  From {inquiry.buyer.name} · {inquiry.buyer.city} · {formatDate(inquiry.createdAt)}
                </p>
              </div>
              <a className="btn btn-ghost" href={`mailto:${inquiry.buyer.email}`}>
                Reply by email
              </a>
            </div>
            <p>{inquiry.message}</p>
            <p className="muted">{inquiry.buyer.email}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
