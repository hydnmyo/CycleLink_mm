import { useEffect, useState } from 'react'
import { ImpactStats } from '../components/ImpactStats'
import { fetchListings } from '../lib/api'
import { CO2_PER_KG, aggregateImpact, formatKg } from '../lib/impact'
import type { ListingWithSeller } from '../types'

export function Impact() {
  const [listings, setListings] = useState<ListingWithSeller[]>([])

  useEffect(() => {
    void fetchListings().then(setListings)
  }, [])

  const stats = aggregateImpact(listings)
  const plasticShare = stats.totalKg ? Math.round((stats.plasticKg / stats.totalKg) * 100) : 0
  const industrialShare = stats.totalKg ? 100 - plasticShare : 0

  return (
    <main className="page">
      <h1>Measured impact</h1>
      <p className="lede">
        CycleLink totals the surplus now listed for reuse. That is material that can stay in
        Myanmar’s production loop instead of landfill, burning, or a new import order.
      </p>
      <ImpactStats listings={listings} />
      <div className="impact-split">
        <section className="panel stack">
          <h2>Plastic scrap</h2>
          <p className="stat-value">{formatKg(stats.plasticKg)}</p>
          <div className="bar" aria-hidden="true">
            <span style={{ width: `${plasticShare}%` }} />
          </div>
          <p className="muted">{plasticShare}% of listed weight</p>
        </section>
        <section className="panel stack">
          <h2>Industrial materials</h2>
          <p className="stat-value">{formatKg(stats.industrialKg)}</p>
          <div className="bar" aria-hidden="true">
            <span style={{ width: `${industrialShare}%` }} />
          </div>
          <p className="muted">{industrialShare}% of listed weight</p>
        </section>
      </div>
      <p className="footnote">
        Weight uses listed quantity. Tons convert at 1,000 kg. Pieces use 15 kg and lots use 200 kg
        as conservative stand-ins when a listing is not sold by weight. CO₂e is estimated at{' '}
        {CO2_PER_KG} kg CO₂e per kg diverted — a transparent demo factor, not a life-cycle audit.
      </p>
    </main>
  )
}
