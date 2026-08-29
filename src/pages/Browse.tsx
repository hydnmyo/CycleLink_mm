import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FeaturedListingCard } from '../components/FeaturedListingCard'
import { EMPTY_FILTERS, MAX_UNIT_PRICE, SearchFilters, type FilterState } from '../components/SearchFilters'
import { MARKETPLACE_CATEGORIES } from '../data/homeCategories'
import { fetchListings } from '../lib/api'
import {
  isAvailableForPickup,
  isVerifiedSeller,
  quantityForFilter,
  requiresProcessing,
  sellerRating,
  unitPriceMmk,
} from '../lib/listingDisplay'
import { matchesSearch } from '../lib/searchListings'
import type { ListingWithSeller } from '../types'

type SortOption = 'recommended' | 'newest' | 'price-asc' | 'price-desc'

function sortListings(listings: ListingWithSeller[], sort: SortOption) {
  const rows = [...listings]
  if (sort === 'newest') {
    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
  if (sort === 'price-asc') {
    return rows.sort((a, b) => (unitPriceMmk(a) ?? Number.MAX_SAFE_INTEGER) - (unitPriceMmk(b) ?? Number.MAX_SAFE_INTEGER))
  }
  if (sort === 'price-desc') {
    return rows.sort((a, b) => (unitPriceMmk(b) ?? -1) - (unitPriceMmk(a) ?? -1))
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

function applyFilters(listings: ListingWithSeller[], filters: FilterState) {
  return listings.filter((listing) => {
    if (filters.category) {
      const category = MARKETPLACE_CATEGORIES.find((item) => item.id === filters.category)
      if (!category?.matches(listing.category, listing.subcategory)) return false
    }
    if (filters.materialType && listing.subcategory !== filters.materialType) return false
    if (filters.condition && listing.condition !== filters.condition) return false
    if (filters.city && listing.city !== filters.city) return false
    if (filters.sellerRating) {
      if (sellerRating(listing.id) < Number(filters.sellerRating)) return false
    }
    const price = unitPriceMmk(listing)
    if (filters.maxPrice < MAX_UNIT_PRICE && price != null && price > filters.maxPrice) return false
    if (quantityForFilter(listing) < filters.minQuantity) return false
    if (filters.verifiedOnly && !isVerifiedSeller()) return false
    if (filters.pickupOnly && !isAvailableForPickup()) return false
    if (filters.processingOnly && !requiresProcessing(listing)) return false
    return true
  })
}

export function Browse() {
  const [params, setParams] = useSearchParams()
  const search = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const [listings, setListings] = useState<ListingWithSeller[]>([])
  const [filters, setFilters] = useState<FilterState>({ ...EMPTY_FILTERS, category })
  const [sort, setSort] = useState<SortOption>('recommended')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    void fetchListings().then((rows) => {
      setListings(rows)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    setFilters((current) =>
      current.category === category
        ? current
        : { ...current, category, materialType: '' },
    )
  }, [category])

  const setSearch = (value: string) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value.trim()) next.set('q', value)
        else next.delete('q')
        return next
      },
      { replace: true },
    )
  }

  const updateFilters = (next: FilterState) => {
    setFilters(next)
    setParams(
      (current) => {
        const updated = new URLSearchParams(current)
        if (next.category) updated.set('category', next.category)
        else updated.delete('category')
        return updated
      },
      { replace: true },
    )
  }

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (search.trim()) next.set('q', search.trim())
        else next.delete('q')
        return next
      },
      { replace: true },
    )
  }

  const visible = useMemo(() => {
    const filtered = applyFilters(listings, filters).filter((listing) => matchesSearch(listing, search))
    return sortListings(filtered, sort)
  }, [listings, filters, search, sort])

  const featuredIds = useMemo(() => {
    return new Set(
      [...listings]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 4)
        .map((listing) => listing.id),
    )
  }, [listings])

  return (
    <main className="browse-page">
      <div className="browse-container">
        <div className="browse-toolbar">
          <form className="browse-search" onSubmit={submitSearch} role="search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search materials, categories, suppliers..."
              aria-label="Search materials, categories, suppliers"
            />
          </form>
          <label className="browse-sort">
            <span className="sr-only">Sort results</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
              <option value="recommended">Recommended</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>
        </div>

        <div className="browse-layout">
        <SearchFilters value={filters} onChange={updateFilters} />
        <section className="browse-results">
          <p className="browse-count">
            {loaded
              ? `${visible.length} material${visible.length === 1 ? '' : 's'} found${search.trim() ? ` for “${search.trim()}”` : ''}`
              : 'Loading materials…'}
          </p>
          {loaded && visible.length === 0 ? (
            <p className="empty">
              No listings match {search.trim() ? `“${search.trim()}”` : 'these filters'}. Try a
              material, category, or supplier name.
            </p>
          ) : (
            <div className="browse-grid">
              {visible.map((listing) => (
                <FeaturedListingCard
                  key={listing.id}
                  listing={listing}
                  featured={featuredIds.has(listing.id)}
                />
              ))}
            </div>
          )}
        </section>
        </div>
      </div>
    </main>
  )
}
