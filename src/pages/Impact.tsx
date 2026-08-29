import { useEffect, useMemo, useState } from 'react'
import { MARKETPLACE_CATEGORIES } from '../data/homeCategories'
import { fetchListings } from '../lib/api'
import { formatCompactMmk } from '../lib/format'
import { COMPLETED_TRANSACTIONS } from '../lib/impact'
import type { ListingWithSeller } from '../types'

const LOOP_STEPS = [
  'Surplus material',
  'Digital marketplace',
  'Business match',
  'Second life',
]

export function Impact() {
  const [listings, setListings] = useState<ListingWithSeller[]>([])

  useEffect(() => {
    void fetchListings().then(setListings)
  }, [])

  const businesses = useMemo(
    () => new Set(listings.map((listing) => listing.businessId)).size,
    [listings],
  )

  const recovered = useMemo(
    () => listings.reduce((sum, listing) => sum + (listing.priceMmk ?? 0), 0),
    [listings],
  )

  const categoryRows = useMemo(() => {
    const rows = MARKETPLACE_CATEGORIES.map((category) => ({
      id: category.id,
      name: category.name,
      count: listings.filter((listing) => category.matches(listing.category, listing.subcategory))
        .length,
    })).filter((row) => row.count > 0)
    rows.sort((a, b) => b.count - a.count)
    return rows
  }, [listings])

  const maxCategory = Math.max(...categoryRows.map((row) => row.count), 1)

  return (
    <main className="impact-page">
      <section className="impact-hero">
        <div className="impact-hero-inner">
          <span className="home-hero-badge">Circular B2B marketplace · Myanmar</span>
          <h1>Give Materials a Second Life.</h1>
          <p>
            We help businesses exchange surplus and recyclable materials instead of allowing usable
            resources to be unnecessarily discarded.
          </p>
        </div>
      </section>

      <div className="impact-body">
        <section className="impact-kpis" aria-label="Impact totals">
          <Kpi value={String(MARKETPLACE_CATEGORIES.length)} label="Material Categories" />
          <Kpi value={String(businesses)} label="Businesses Connected" />
          <Kpi value={String(COMPLETED_TRANSACTIONS)} label="Completed Transactions" />
          <Kpi value={formatCompactMmk(recovered)} label="Surplus Value Recovered" />
          <Kpi value={String(listings.length)} label="Active Listings" />
        </section>

        <div className="impact-grid">
          <section className="impact-card">
            <h2>Active listings by category</h2>
            {categoryRows.length === 0 ? (
              <p className="muted">Listings will appear here once surplus is posted.</p>
            ) : (
              <ul className="impact-bars">
                {categoryRows.map((row) => (
                  <li key={row.id}>
                    <div className="impact-bar-label">
                      <span>{row.name}</span>
                      <span>
                        {row.count} {row.count === 1 ? 'listing' : 'listings'}
                      </span>
                    </div>
                    <div className="impact-bar" aria-hidden="true">
                      <span style={{ width: `${Math.round((row.count / maxCategory) * 100)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="impact-card">
            <h2>The impact loop</h2>
            <ol className="impact-loop">
              {LOOP_STEPS.map((step, index) => (
                <li key={step}>
                  <span className="impact-loop-num">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </main>
  )
}

function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <article className="impact-kpi">
      <div className="impact-kpi-value">{value}</div>
      <div className="impact-kpi-label">{label}</div>
    </article>
  )
}
