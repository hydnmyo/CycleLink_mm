import type { Listing, Unit } from '../types'

/** Conservative kg equivalents for non-weight units. Documented on the Impact page. */
const UNIT_TO_KG: Record<Unit, number> = {
  kg: 1,
  ton: 1000,
  piece: 15,
  lot: 200,
}

export const CO2_PER_KG = 0.5

/** Recorded exchanges shown on the Impact page until a transactions API exists. */
export const COMPLETED_TRANSACTIONS = 5

export function quantityToKg(quantity: number, unit: Unit): number {
  return quantity * UNIT_TO_KG[unit]
}

export function listingKg(listing: Pick<Listing, 'quantity' | 'unit'>): number {
  return quantityToKg(listing.quantity, listing.unit)
}

export function listingCo2e(listing: Pick<Listing, 'quantity' | 'unit'>): number {
  return listingKg(listing) * CO2_PER_KG
}

export function formatKg(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toLocaleString('en-MM', { maximumFractionDigits: 1 })} t`
  }
  return `${Math.round(kg).toLocaleString('en-MM')} kg`
}

export function formatCo2e(kgCo2e: number): string {
  if (kgCo2e >= 1000) {
    return `${(kgCo2e / 1000).toLocaleString('en-MM', { maximumFractionDigits: 1 })} t CO₂e`
  }
  return `${Math.round(kgCo2e).toLocaleString('en-MM')} kg CO₂e`
}

export function aggregateImpact(listings: Pick<Listing, 'quantity' | 'unit' | 'category'>[]) {
  const totalKg = listings.reduce((sum, listing) => sum + listingKg(listing), 0)
  const plasticKg = listings
    .filter((listing) => listing.category === 'plastic')
    .reduce((sum, listing) => sum + listingKg(listing), 0)
  const industrialKg = listings
    .filter((listing) => listing.category === 'industrial')
    .reduce((sum, listing) => sum + listingKg(listing), 0)

  return {
    listingCount: listings.length,
    totalKg,
    plasticKg,
    industrialKg,
    co2eKg: totalKg * CO2_PER_KG,
  }
}
