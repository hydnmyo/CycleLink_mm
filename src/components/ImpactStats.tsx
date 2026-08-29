import { aggregateImpact, formatCo2e, formatKg } from '../lib/impact'
import type { Listing } from '../types'

export function ImpactStats({ listings }: { listings: Listing[] }) {
  const stats = aggregateImpact(listings)
  const businesses = new Set(listings.map((listing) => listing.businessId)).size

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-value">{formatKg(stats.totalKg)}</div>
        <div className="stat-label">Surplus listed for reuse</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{formatCo2e(stats.co2eKg)}</div>
        <div className="stat-label">Estimated CO₂e avoided</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{businesses}</div>
        <div className="stat-label">Businesses connected</div>
      </div>
    </div>
  )
}
