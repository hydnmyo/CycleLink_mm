import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CategoryBadge } from '../components/CategoryBadge'
import { ListingCard } from '../components/ListingCard'
import { fetchListings, fetchWantedItem, updateWantedStatus } from '../lib/api'
import { formatDate, formatQuantity } from '../lib/format'
import { materialsMatch } from '../lib/match'
import { useAuth } from '../context/AuthProvider'
import type { ListingWithSeller, WantedWithBuyer } from '../types'

export function WantedDetail() {
  const { id } = useParams()
  const wantedId = Number(id)
  const { user } = useAuth()
  const [need, setNeed] = useState<WantedWithBuyer | null>(null)
  const [matches, setMatches] = useState<ListingWithSeller[]>([])
  const [loaded, setLoaded] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!Number.isFinite(wantedId)) {
      setLoaded(true)
      return
    }
    void Promise.all([fetchWantedItem(wantedId), fetchListings()]).then(([row, listings]) => {
      setNeed(row)
      if (row) {
        setMatches(
          listings.filter(
            (listing) =>
              listing.businessId !== row.businessId && materialsMatch(listing, row),
          ),
        )
      }
      setLoaded(true)
    })
  }, [wantedId])

  if (!loaded) {
    return (
      <main className="page">
        <p className="muted">Loading wanted listing…</p>
      </main>
    )
  }

  if (!need) {
    return (
      <main className="page">
        <p className="empty">This wanted listing was not found.</p>
        <Link to="/wanted">Back to wanted</Link>
      </main>
    )
  }

  const markFilled = async () => {
    setPending(true)
    setError('')
    try {
      const updated = await updateWantedStatus(need.id, need.status === 'active' ? 'filled' : 'active')
      setNeed(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update status.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="page">
      <article className="card detail-main">
        <div className="badge-row">
          <span className="badge badge-neutral">Wanted</span>
          <CategoryBadge category={need.category} subcategory={need.subcategory} />
          <span className="badge badge-neutral">{need.city}</span>
          <span className="badge badge-neutral">{need.status}</span>
        </div>
        <h1>{need.title}</h1>
        <p>{need.description}</p>
        <p>
          <strong>Needs {formatQuantity(need.quantity, need.unit)}</strong>
        </p>
        <p className="muted">Posted {formatDate(need.createdAt)}</p>
        <aside className="card seller-card">
          <h2>Buyer</h2>
          <p>
            <strong>{need.buyer.name}</strong>
          </p>
          <p className="muted">
            {need.buyer.industry} · {need.buyer.city}
          </p>
          <p className="muted">{need.buyer.email}</p>
        </aside>
          {user?.email && user.email === need.buyer.email ? (
          <button className="btn btn-ghost" type="button" disabled={pending} onClick={() => void markFilled()}>
            {pending ? 'Saving…' : need.status === 'active' ? 'Mark as filled' : 'Reopen'}
          </button>
        ) : null}
        {error ? <p className="error">{error}</p> : null}
        <Link className="btn btn-primary" to="/listings/new">
          List matching surplus
        </Link>
      </article>

      <div className="section-head" style={{ marginTop: 28 }}>
        <h2>Matching surplus</h2>
        <p className="muted">Same material type and city.</p>
      </div>
      {matches.length ? (
        <div className="listing-grid">
          {matches.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <p className="empty">No matching surplus is listed in this city yet.</p>
      )}
    </main>
  )
}
