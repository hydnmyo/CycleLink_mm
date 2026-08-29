import { useEffect, useMemo, useState } from 'react'
import { ListingCard } from '../components/ListingCard'
import { EMPTY_FILTERS, SearchFilters, type FilterState } from '../components/SearchFilters'
import { fetchListings } from '../lib/api'
import { listingKg } from '../lib/impact'
import type { ListingWithSeller } from '../types'

function applyFilters(listings: ListingWithSeller[], filters: FilterState) {
  const query = filters.query.trim().toLowerCase()
  const filtered = listings.filter((listing) => {
    const haystack = `${listing.title} ${listing.description} ${listing.seller.name} ${listing.city} ${listing.subcategory}`.toLowerCase()
    if (query && !haystack.includes(query)) return false
    if (filters.category && listing.category !== filters.category) return false
    if (filters.subcategory && listing.subcategory !== filters.subcategory) return false
    if (filters.city && listing.city !== filters.city) return false
    if (filters.condition && listing.condition !== filters.condition) return false
    return true
  })

  return filtered.sort((a, b) => {
    if (filters.sort === 'price-asc') {
      const left = a.priceMmk ?? Number.POSITIVE_INFINITY
      const right = b.priceMmk ?? Number.POSITIVE_INFINITY
      return left - right
    }
    if (filters.sort === 'quantity-desc') {
      return listingKg(b) - listingKg(a)
    }
    return b.createdAt.localeCompare(a.createdAt)
  })
}

export function Browse() {
  const [listings, setListings] = useState<ListingWithSeller[]>([])
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    void fetchListings().then((rows) => {
      setListings(rows)
      setLoaded(true)
    })
  }, [])

  const visible = useMemo(() => applyFilters(listings, filters), [listings, filters])

  return (
    <main className="page">
      <h1>Browse surplus</h1>
      <p className="lede">
        Plastic scrap and industrial materials listed by Myanmar businesses. Search by material,
        seller, or city.
      </p>
      <div style={{ height: 20 }} />
      <SearchFilters value={filters} onChange={setFilters} />
      {loaded && visible.length === 0 ? (
        <p className="empty">No listings match these filters. Try another city or material.</p>
      ) : (
        <div className="listing-grid">
          {visible.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  )
}
