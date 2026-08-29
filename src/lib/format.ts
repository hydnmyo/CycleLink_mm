import type { Condition, Unit } from '../types'

const mmk = new Intl.NumberFormat('en-MM')

export function formatMmk(price: number | null): string {
  if (price == null) return 'Contact for price'
  return `${mmk.format(price)} MMK`
}

export function formatQuantity(quantity: number, unit: Unit): string {
  const formatted = Number.isInteger(quantity)
    ? mmk.format(quantity)
    : quantity.toLocaleString('en-MM', { maximumFractionDigits: 2 })
  return `${formatted} ${unit}${quantity === 1 ? '' : unit === 'piece' || unit === 'lot' ? 's' : ''}`
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function conditionLabel(condition: Condition): string {
  return condition.charAt(0).toUpperCase() + condition.slice(1)
}

export function categoryLabel(category: string): string {
  if (category === 'plastic') return 'Plastic'
  if (category === 'industrial') return 'Industrial'
  return category
}
