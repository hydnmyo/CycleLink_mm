import { CITIES } from '../../data/categories'
import { quantityToKg } from '../impact'
import type { ListingWithSeller, Unit } from '../../types'
import type { MaterialKind } from './copy'

const UNIT_WORDS: Record<string, Unit> = {
  kg: 'kg',
  kilo: 'kg',
  kilos: 'kg',
  kilogram: 'kg',
  kilograms: 'kg',
  ton: 'ton',
  tons: 'ton',
  tonne: 'ton',
  tonnes: 'ton',
  piece: 'piece',
  pieces: 'piece',
  lot: 'lot',
  lots: 'lot',
}

export function listingMatchesMaterial(listing: ListingWithSeller, material: MaterialKind): boolean {
  const haystack = `${listing.title} ${listing.description} ${listing.subcategory}`.toLowerCase()
  switch (material) {
    case 'plastic':
      return listing.category === 'plastic'
    case 'textile':
      return listing.subcategory === 'textile' || /textile|fabric|garment|cotton|cloth/.test(haystack)
    case 'metal':
      return listing.subcategory === 'metal' || /metal|steel|stainless|aluminium|aluminum/.test(haystack)
    case 'paper':
      return /paper|cardboard|carton|pulp/.test(haystack)
    case 'wood':
      return /wood|timber|lumber|plywood/.test(haystack)
    case 'rubber':
      return /rubber|conveyor belt/.test(haystack)
    case 'electronic':
      return /electronic|circuit|pcb|motor housing|oem/.test(haystack)
    case 'other':
      return listing.subcategory === 'other' || listing.subcategory === 'machinery'
    default:
      return false
  }
}

export function searchListings(
  listings: ListingWithSeller[],
  filters: {
    material: MaterialKind
    city: string | null
    minKg: number | null
    maxBudget: number | null
  },
): ListingWithSeller[] {
  return listings.filter((listing) => {
    if (!listingMatchesMaterial(listing, filters.material)) return false
    if (filters.city && listing.city !== filters.city) return false
    if (filters.minKg != null && quantityToKg(listing.quantity, listing.unit) + 0.01 < filters.minKg) {
      return false
    }
    if (filters.maxBudget != null) {
      if (listing.priceMmk == null) return false
      if (listing.priceMmk > filters.maxBudget) return false
    }
    return true
  })
}

export function estimatePriceMmkPerKg(
  listings: ListingWithSeller[],
  filters: { material: MaterialKind; condition: string; city: string | null },
): { count: number; mmkPerKg: number } | null {
  const priced = listings.filter((listing) => {
    if (listing.priceMmk == null || listing.priceMmk <= 0) return false
    if (!listingMatchesMaterial(listing, filters.material)) return false
    if (listing.condition !== filters.condition) return false
    if (filters.city && listing.city !== filters.city) return false
    return quantityToKg(listing.quantity, listing.unit) > 0
  })
  if (priced.length < 2) return null
  const rates = priced
    .map((listing) => listing.priceMmk! / quantityToKg(listing.quantity, listing.unit))
    .sort((a, b) => a - b)
  const mid = Math.floor(rates.length / 2)
  const median = rates.length % 2 ? rates[mid] : (rates[mid - 1] + rates[mid]) / 2
  return { count: priced.length, mmkPerKg: median }
}

export function parseQuantityInput(raw: string): { kg: number; label: string } | null {
  const text = raw.trim().toLowerCase().replaceAll(',', '')
  const match = text.match(/(\d+(?:\.\d+)?)\s*([a-z]+)?/)
  if (!match) return null
  const amount = Number(match[1])
  if (!Number.isFinite(amount) || amount <= 0) return null
  const unit = UNIT_WORDS[match[2] ?? 'kg'] ?? null
  if (!unit) return null
  return { kg: quantityToKg(amount, unit), label: `${amount} ${unit}` }
}

export function parseBudgetInput(raw: string): number | null {
  const digits = raw.replace(/[^\d.]/g, '')
  if (!digits) return null
  const value = Number(digits)
  if (!Number.isFinite(value) || value <= 0) return null
  return Math.round(value)
}

export function detectMaterialFromText(raw: string): MaterialKind | null {
  const text = raw.toLowerCase()
  if (/fabric|textile|garment|cotton|cloth|အထည်/.test(text)) return 'textile'
  if (/plastic|pet|hdpe|pp|ပလတ်/.test(text)) return 'plastic'
  if (/paper|cardboard|စက္ကူ/.test(text)) return 'paper'
  if (/metal|steel|iron|သတ္တု/.test(text)) return 'metal'
  if (/wood|timber|သစ်/.test(text)) return 'wood'
  if (/rubber|ရော်ဘာ/.test(text)) return 'rubber'
  if (/electronic|circuit|အီလက်/.test(text)) return 'electronic'
  return null
}

export function cityFromText(raw: string): { city: string | null; matched: boolean } {
  const text = raw.toLowerCase()
  if (/any|anywhere|မရွေး|all cities/.test(text)) return { city: null, matched: true }
  for (const city of CITIES) {
    if (text.includes(city.toLowerCase())) return { city, matched: true }
  }
  return { city: null, matched: false }
}
