import { categoryLabel } from '../lib/format'
import type { Category } from '../types'

export function CategoryBadge({
  category,
  subcategory,
}: {
  category: Category | string
  subcategory?: string
}) {
  const kind = category === 'industrial' ? 'industrial' : 'plastic'
  return (
    <span className={`badge badge-${kind}`}>
      {categoryLabel(category)}
      {subcategory ? ` · ${subcategory}` : ''}
    </span>
  )
}
