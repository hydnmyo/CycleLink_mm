import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EMPTY_FILTERS, SearchFilters, type FilterState } from '../components/SearchFilters'
import { WantedCard } from '../components/WantedCard'
import { fetchWanted } from '../lib/api'
import type { WantedWithBuyer } from '../types'

function applyFilters(rows: WantedWithBuyer[], filters: FilterState) {
  const query = filters.query.trim().toLowerCase()
  return rows.filter((need) => {
    const haystack = `${need.title} ${need.description} ${need.buyer.name} ${need.city} ${need.subcategory}`.toLowerCase()
    if (query && !haystack.includes(query)) return false
    if (filters.category && need.category !== filters.category) return false
    if (filters.subcategory && need.subcategory !== filters.subcategory) return false
    if (filters.city && need.city !== filters.city) return false
    return true
  })
}

export function BrowseWanted() {
  const [rows, setRows] = useState<WantedWithBuyer[]>([])
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    void fetchWanted().then((items) => {
      setRows(items)
      setLoaded(true)
    })
  }, [])

  const visible = useMemo(() => applyFilters(rows, filters), [rows, filters])

  return (
    <main className="page">
      <div className="section-heading">
        <div>
          <h1>Wanted materials</h1>
          <p className="lede">
            Factories post what they need to buy. If you have matching surplus, open the request and
            list or inquire.
          </p>
        </div>
        <Link className="btn btn-primary" to="/wanted/new">
          Post a need
        </Link>
      </div>
      <SearchFilters value={filters} onChange={setFilters} />
      {loaded && visible.length === 0 ? (
        <p className="empty">No wanted posts match these filters.</p>
      ) : (
        <div className="listing-grid">
          {visible.map((need) => (
            <WantedCard key={need.id} need={need} />
          ))}
        </div>
      )}
    </main>
  )
}
