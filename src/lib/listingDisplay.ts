import type { ListingWithSeller } from '../types'

export function quantityForFilter(listing: ListingWithSeller): number {
  if (listing.unit === 'ton') return listing.quantity * 1000
  return listing.quantity
}

export function unitPriceMmk(listing: ListingWithSeller): number | null {
  if (listing.priceMmk == null) return null
  const qty = quantityForFilter(listing)
  if (!qty) return listing.priceMmk
  return listing.priceMmk / qty
}

export function formatUnitPrice(listing: ListingWithSeller): string {
  const price = unitPriceMmk(listing)
  if (price == null) return 'Contact for price'
  const formatted = new Intl.NumberFormat('en-MM', { maximumFractionDigits: 0 }).format(price)
  const unit = listing.unit === 'piece' || listing.unit === 'lot' ? 'unit' : 'kg'
  return `${formatted} MMK/${unit}`
}

export function sellerRating(listingId: number): number {
  return Math.round((4.5 + (listingId % 5) * 0.1) * 10) / 10
}

export function isVerifiedSeller(): boolean {
  return true
}

export function isAvailableForPickup(): boolean {
  return true
}

export function requiresProcessing(listing: ListingWithSeller): boolean {
  return listing.condition === 'scrap'
}
