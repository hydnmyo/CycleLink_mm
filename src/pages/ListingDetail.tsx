import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CategoryBadge } from '../components/CategoryBadge'
import { InquiryModal } from '../components/InquiryModal'
import { ListingImage } from '../components/ListingImage'
import { WantedCard } from '../components/WantedCard'
import { useAuth } from '../context/AuthProvider'
import { fetchListing, fetchWanted } from '../lib/api'
import { conditionLabel, formatDate, formatMmk, formatQuantity } from '../lib/format'
import { formatCo2e, formatKg, listingCo2e, listingKg } from '../lib/impact'
import { materialsMatch } from '../lib/match'
import type { ListingWithSeller, WantedWithBuyer } from '../types'

export function ListingDetail() {
  const { id } = useParams()
  const listingId = Number(id)
  const { user, identityAvailable } = useAuth()
  const [listing, setListing] = useState<ListingWithSeller | null>(null)
  const [wantedMatches, setWantedMatches] = useState<WantedWithBuyer[]>([])
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!Number.isFinite(listingId)) {
      setLoaded(true)
      return
    }
    void Promise.all([fetchListing(listingId), fetchWanted()]).then(([row, wanted]) => {
      setListing(row)
      if (row) {
        setWantedMatches(
          wanted.filter(
            (need) => need.businessId !== row.businessId && materialsMatch(row, need),
          ),
        )
      }
      setLoaded(true)
    })
  }, [listingId])

  if (!loaded) {
    return (
      <main className="page">
        <p className="muted">Loading listing…</p>
      </main>
    )
  }

  if (!listing) {
    return (
      <main className="page">
        <p className="empty">This listing was not found.</p>
        <Link to="/browse">Back to browse</Link>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="detail-layout">
        <article className="card detail-main">
          <ListingImage
            className="listing-detail-image"
            title={listing.title}
            category={listing.category}
            imageUrl={listing.imageUrl}
          />
          <div className="badge-row">
            <CategoryBadge category={listing.category} subcategory={listing.subcategory} />
            <span className="badge badge-neutral">{conditionLabel(listing.condition)}</span>
            <span className="badge badge-neutral">{listing.city}</span>
          </div>
          <h1>{listing.title}</h1>
          <p>{listing.description}</p>
          <p>
            <strong>{formatQuantity(listing.quantity, listing.unit)}</strong>
            {' · '}
            {formatMmk(listing.priceMmk)}
          </p>
          <p className="muted">Listed {formatDate(listing.createdAt)}</p>
          <p>
            Reusing this lot could divert about <strong>{formatKg(listingKg(listing))}</strong> from
            waste streams ({formatCo2e(listingCo2e(listing))} using the site estimate).
          </p>
          {user ? (
            <button className="btn btn-primary" type="button" onClick={() => setOpen(true)}>
              Send inquiry
            </button>
          ) : (
            <Link
              className="btn btn-primary"
              to={
                identityAvailable
                  ? `/login?next=/listings/${listing.id}`
                  : '/how-it-works'
              }
            >
              {identityAvailable ? 'Sign in to inquire' : 'How inquiries work'}
            </Link>
          )}
        </article>
        <aside className="card seller-card">
          <h2>Seller</h2>
          <p>
            <strong>{listing.seller.name}</strong>
          </p>
          <p className="muted">
            {listing.seller.industry} · {listing.seller.city}
          </p>
          <p className="muted">{listing.seller.email}</p>
        </aside>
      </div>
      {wantedMatches.length ? (
        <div style={{ marginTop: 28 }}>
          <h2>Buyers looking for this material</h2>
          <p className="muted">Same type and city as this surplus listing.</p>
          <div className="listing-grid">
            {wantedMatches.map((need) => (
              <WantedCard key={need.id} need={need} />
            ))}
          </div>
        </div>
      ) : null}
      {open ? (
        <InquiryModal
          listingId={listing.id}
          listingTitle={listing.title}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </main>
  )
}
