import { CITIES, CONDITIONS, SUBCATEGORIES } from '../data/categories'
import { MARKETPLACE_CATEGORIES } from '../data/homeCategories'

export type FilterState = {
  category: string
  materialType: string
  condition: string
  city: string
  sellerRating: string
  maxPrice: number
  minQuantity: number
  verifiedOnly: boolean
  pickupOnly: boolean
  processingOnly: boolean
}

export const MAX_UNIT_PRICE = 50000
export const MAX_MIN_QUANTITY = 1000

export const EMPTY_FILTERS: FilterState = {
  category: '',
  materialType: '',
  condition: '',
  city: '',
  sellerRating: '',
  maxPrice: MAX_UNIT_PRICE,
  minQuantity: 0,
  verifiedOnly: false,
  pickupOnly: false,
  processingOnly: false,
}

const ALL_MATERIAL_TYPES = Object.values(SUBCATEGORIES).flat()

function materialTypesForCategory(categoryId: string) {
  if (categoryId === 'plastic') return SUBCATEGORIES.plastic
  if (categoryId === 'textile') return SUBCATEGORIES.industrial.filter((item) => item.value === 'textile')
  if (categoryId === 'metal') return SUBCATEGORIES.industrial.filter((item) => item.value === 'metal')
  if (categoryId === 'components') return SUBCATEGORIES.industrial.filter((item) => item.value === 'machinery')
  if (categoryId === 'other') return SUBCATEGORIES.industrial.filter((item) => item.value === 'other')
  if (!categoryId) return ALL_MATERIAL_TYPES
  return []
}

function formatPriceLabel(value: number) {
  return new Intl.NumberFormat('en-MM').format(value)
}

export function SearchFilters({
  value,
  onChange,
}: {
  value: FilterState
  onChange: (next: FilterState) => void
}) {
  const materialTypes = materialTypesForCategory(value.category)

  return (
    <aside className="browse-filters" aria-label="Filters">
      <div className="browse-filters-head">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="8" cy="6" r="2" fill="currentColor" />
          <circle cx="14" cy="12" r="2" fill="currentColor" />
          <circle cx="10" cy="18" r="2" fill="currentColor" />
        </svg>
        <h2>Filters</h2>
      </div>

      <label className="browse-filter-field">
        <span>Category</span>
        <select
          value={value.category}
          onChange={(event) =>
            onChange({ ...value, category: event.target.value, materialType: '' })
          }
        >
          <option value="">All</option>
          {MARKETPLACE_CATEGORIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label className="browse-filter-field">
        <span>Material Type</span>
        <select
          value={value.materialType}
          disabled={materialTypes.length === 0}
          onChange={(event) => onChange({ ...value, materialType: event.target.value })}
        >
          <option value="">All</option>
          {materialTypes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="browse-filter-field">
        <span>Condition</span>
        <select
          value={value.condition}
          onChange={(event) => onChange({ ...value, condition: event.target.value })}
        >
          <option value="">All</option>
          {CONDITIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="browse-filter-field">
        <span>Location</span>
        <select
          value={value.city}
          onChange={(event) => onChange({ ...value, city: event.target.value })}
        >
          <option value="">All</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className="browse-filter-field">
        <span>Seller Rating</span>
        <select
          value={value.sellerRating}
          onChange={(event) => onChange({ ...value, sellerRating: event.target.value })}
        >
          <option value="">All</option>
          <option value="4.5">4.5+</option>
          <option value="4.7">4.7+</option>
          <option value="4.8">4.8+</option>
          <option value="4.9">4.9+</option>
        </select>
      </label>

      <label className="browse-filter-field">
        <span>Max Unit Price — {formatPriceLabel(value.maxPrice)} MMK</span>
        <input
          className="browse-range"
          type="range"
          min={0}
          max={MAX_UNIT_PRICE}
          step={500}
          value={value.maxPrice}
          onChange={(event) => onChange({ ...value, maxPrice: Number(event.target.value) })}
        />
      </label>

      <label className="browse-filter-field">
        <span>Min Quantity — {formatPriceLabel(value.minQuantity)}</span>
        <input
          className="browse-range"
          type="range"
          min={0}
          max={MAX_MIN_QUANTITY}
          step={10}
          value={value.minQuantity}
          onChange={(event) => onChange({ ...value, minQuantity: Number(event.target.value) })}
        />
      </label>

      <div className="browse-filter-toggles">
        <label className="browse-check">
          <input
            type="checkbox"
            checked={value.verifiedOnly}
            onChange={(event) => onChange({ ...value, verifiedOnly: event.target.checked })}
          />
          Verified Business
        </label>
        <label className="browse-check">
          <input
            type="checkbox"
            checked={value.pickupOnly}
            onChange={(event) => onChange({ ...value, pickupOnly: event.target.checked })}
          />
          Available for Pickup
        </label>
        <label className="browse-check">
          <input
            type="checkbox"
            checked={value.processingOnly}
            onChange={(event) => onChange({ ...value, processingOnly: event.target.checked })}
          />
          Requires Processing
        </label>
      </div>
    </aside>
  )
}
