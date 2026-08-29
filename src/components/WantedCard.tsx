import { Link } from 'react-router-dom'
import { formatQuantity } from '../lib/format'
import type { WantedWithBuyer } from '../types'
import { CategoryBadge } from './CategoryBadge'

export function WantedCard({ need }: { need: WantedWithBuyer }) {
  return (
    <Link className="card listing-card" to={`/wanted/${need.id}`}>
      <div className="badge-row">
        <span className="badge badge-neutral">Wanted</span>
        <CategoryBadge category={need.category} subcategory={need.subcategory} />
        <span className="badge badge-neutral">{need.city}</span>
      </div>
      <h3>{need.title}</h3>
      <p className="card-meta">{need.buyer.name}</p>
      <p className="card-meta">Needs {formatQuantity(need.quantity, need.unit)}</p>
    </Link>
  )
}
