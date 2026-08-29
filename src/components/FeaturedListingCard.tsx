import { Link } from 'react-router-dom'
import { displayCategoryName, listingImage } from '../data/homeCategories'
import { formatQuantity } from '../lib/format'
import { formatUnitPrice, requiresProcessing, sellerRating } from '../lib/listingDisplay'
import type { ListingWithSeller } from '../types'

function surplusType(listing: ListingWithSeller): string {
  if (listing.condition === 'scrap') return 'Recyclable Material'
  if (listing.category === 'plastic') return 'Packaging Surplus'
  return 'Production Surplus'
}

function conditionDisplay(condition: string): string {
  if (condition === 'new') return 'New / Unused'
  if (condition === 'used') return 'Like New'
  return 'Scrap / Requires Processing'
}

export function FeaturedListingCard({
  listing,
  featured = true,
}: {
  listing: ListingWithSeller
  featured?: boolean
}) {
  const image = listing.imageUrl || listingImage(listing.category, listing.subcategory)
  const categoryName = displayCategoryName(listing.category, listing.subcategory)
  const rating = sellerRating(listing.id).toFixed(1)

  return (
    <article className="featured-card">
      <div className="featured-card-image">
        <img src={image} alt={listing.title} loading="lazy" />
        <div className="featured-card-badges">
          <span className="featured-badge featured-badge-category">{categoryName}</span>
          {featured ? <span className="featured-badge featured-badge-featured">Featured</span> : null}
        </div>
        {requiresProcessing(listing) ? (
          <div className="featured-card-processing">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12a8 8 0 0 1 14.3-4.8" />
              <path d="M20 12a8 8 0 0 1-14.3 4.8" />
              <polyline points="18 4 18 8 14 8" />
              <polyline points="6 20 6 16 10 16" />
            </svg>
            Requires Processing
          </div>
        ) : null}
      </div>
      <div className="featured-card-body">
        <h3>{listing.title}</h3>
        <div className="featured-card-tags">
          <span className="tag tag-tan">{surplusType(listing)}</span>
          <span className="tag tag-outline">{conditionDisplay(listing.condition)}</span>
        </div>
        <p className="featured-card-price">{formatUnitPrice(listing)}</p>
        <div className="featured-card-meta">
          <span>{formatQuantity(listing.quantity, listing.unit)} available</span>
          <span className="featured-card-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {listing.city}
          </span>
        </div>
        <div className="featured-card-footer">
          <div className="featured-card-seller">
            <span className="seller-name">{listing.seller.name}</span>
            <div className="seller-meta">
              <span className="seller-rating">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {rating}
              </span>
              <span className="seller-verified">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                Verified
              </span>
            </div>
          </div>
          <Link className="btn btn-primary btn-sm" to={`/listings/${listing.id}`}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
