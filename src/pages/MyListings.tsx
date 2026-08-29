import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyListings, updateListing } from '../lib/api'
import { formatMmk, formatQuantity } from '../lib/format'
import type { ListingWithSeller, ListingStatus } from '../types'

export function MyListings() {
  const [listings, setListings] = useState<ListingWithSeller[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void fetchMyListings()
      .then(setListings)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Could not load your listings.')
      })
      .finally(() => setLoading(false))
  }, [])

  const setStatus = async (listing: ListingWithSeller, status: ListingStatus) => {
    setPendingId(listing.id)
    setError('')
    try {
      const updated = await updateListing(listing.id, { status })
      setListings((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update listing.')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <main className="page">
      <div className="section-heading">
        <div>
          <h1>My listings</h1>
          <p className="lede">Manage the surplus listings posted by your business.</p>
        </div>
        <Link className="btn btn-primary" to="/listings/new">
          List surplus
        </Link>
      </div>

      {loading ? <p className="muted">Loading your listings…</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {!loading && listings.length === 0 ? <p className="empty">You have no listings yet.</p> : null}

      <div className="stack">
        {listings.map((listing) => {
          const status = listing.status ?? 'active'
          const nextStatus: ListingStatus = status === 'active' ? 'sold' : 'active'
          return (
            <article className="card management-card" key={listing.id}>
              <div>
                <div className="badge-row">
                  <span className="badge badge-neutral">{status}</span>
                  <span className="badge badge-neutral">{listing.city}</span>
                </div>
                <h2>
                  <Link to={`/listings/${listing.id}`}>{listing.title}</Link>
                </h2>
                <p className="muted">
                  {formatQuantity(listing.quantity, listing.unit)} · {formatMmk(listing.priceMmk)}
                </p>
              </div>
              <button
                className="btn btn-ghost"
                type="button"
                disabled={pendingId === listing.id}
                onClick={() => void setStatus(listing, nextStatus)}
              >
                {pendingId === listing.id
                  ? 'Saving…'
                  : status === 'active'
                    ? 'Mark as sold'
                    : 'Reactivate'}
              </button>
            </article>
          )
        })}
      </div>
    </main>
  )
}
