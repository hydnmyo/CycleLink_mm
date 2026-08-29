import { Link } from 'react-router-dom'
import { formatMmk, formatQuantity } from '../../lib/format'
import { t, type LoopiLang } from '../../lib/loopi/copy'
import type { ListingWithSeller } from '../../types'

export function ListingResultCard({
  listing,
  lang,
}: {
  listing: ListingWithSeller
  lang: LoopiLang
}) {
  return (
    <article className="loopi-listing">
      <div className="loopi-listing-thumb" aria-hidden="true">
        <span>{listing.subcategory.slice(0, 3).toUpperCase()}</span>
        <small>{t(lang, 'noPhoto')}</small>
      </div>
      <div className="loopi-listing-body">
        <h3>{listing.title}</h3>
        <p>
          {t(lang, 'price')}: {formatMmk(listing.priceMmk)}
        </p>
        <p>
          {t(lang, 'qty')}: {formatQuantity(listing.quantity, listing.unit)}
        </p>
        <p>
          {t(lang, 'location')}: {listing.city}
        </p>
        <p>
          {t(lang, 'seller')}: {listing.seller.name}
        </p>
        <p className="loopi-listing-avail">{t(lang, 'listedAvailable')}</p>
        <Link className="btn btn-primary loopi-listing-link" to={`/listings/${listing.id}`}>
          {t(lang, 'viewListing')}
        </Link>
      </div>
    </article>
  )
}
