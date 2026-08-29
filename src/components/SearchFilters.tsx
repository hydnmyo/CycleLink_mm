import { CITIES, CATEGORIES, CONDITIONS, SUBCATEGORIES } from '../data/categories'
import type { Category } from '../types'

export type FilterState = {
  query: string
  category: '' | Category
  subcategory: string
  city: string
  condition: string
  sort: 'newest' | 'price-asc' | 'quantity-desc'
}

export const EMPTY_FILTERS: FilterState = {
  query: '',
  category: '',
  subcategory: '',
  city: '',
  condition: '',
  sort: 'newest',
}

export function SearchFilters({
  value,
  onChange,
}: {
  value: FilterState
  onChange: (next: FilterState) => void
}) {
  const subcategories = value.category ? SUBCATEGORIES[value.category] : []

  return (
    <div className="filters">
      <label className="field">
        <span>Search</span>
        <input
          type="search"
          placeholder="Material, business, city…"
          value={value.query}
          onChange={(event) => onChange({ ...value, query: event.target.value })}
        />
      </label>
      <label className="field">
        <span>Category</span>
        <select
          value={value.category}
          onChange={(event) =>
            onChange({
              ...value,
              category: event.target.value as FilterState['category'],
              subcategory: '',
            })
          }
        >
          <option value="">All categories</option>
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Type</span>
        <select
          value={value.subcategory}
          disabled={!value.category}
          onChange={(event) => onChange({ ...value, subcategory: event.target.value })}
        >
          <option value="">All types</option>
          {subcategories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>City</span>
        <select
          value={value.city}
          onChange={(event) => onChange({ ...value, city: event.target.value })}
        >
          <option value="">All cities</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Sort</span>
        <select
          value={value.sort}
          onChange={(event) =>
            onChange({ ...value, sort: event.target.value as FilterState['sort'] })
          }
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="quantity-desc">Largest quantity</option>
        </select>
      </label>
      <label className="field">
        <span>Condition</span>
        <select
          value={value.condition}
          onChange={(event) => onChange({ ...value, condition: event.target.value })}
        >
          <option value="">Any condition</option>
          {CONDITIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
