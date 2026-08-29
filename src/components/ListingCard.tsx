import { Link } from 'react-router-dom'
import { formatMmk, formatQuantity } from '../lib/format'
import type { ListingWithSeller } from '../types'
import { CategoryBadge } from './CategoryBadge'

export function ListingCard({ listing }: { listing: ListingWithSeller }) {
  return (
    <Link className="card listing-card" to={`/listings/${listing.id}`}>
      <div className="badge-row">
        <CategoryBadge category={listing.category} subcategory={listing.subcategory} />
        <span className="badge badge-neutral">{listing.city}</span>
      </div>
      <h3>{listing.title}</h3>
      <p className="card-meta">{listing.seller.name}</p>
      <p className="card-meta">{formatQuantity(listing.quantity, listing.unit)}</p>
      <p className="card-price">{formatMmk(listing.priceMmk)}</p>
    </Link>
  )
}
