import { MARKETPLACE_CATEGORIES, displayCategoryName } from '../data/homeCategories'
import type { ListingWithSeller } from '../types'

function listingHaystack(listing: ListingWithSeller): string {
  const matchedCategories = MARKETPLACE_CATEGORIES.filter((category) =>
    category.matches(listing.category, listing.subcategory),
  )

  return [
    listing.title,
    listing.description,
    listing.city,
    listing.category,
    listing.subcategory,
    listing.condition,
    listing.unit,
    listing.seller.name,
    listing.seller.industry,
    listing.seller.city,
    listing.seller.email,
    displayCategoryName(listing.category, listing.subcategory),
    ...matchedCategories.flatMap((category) => [category.id, category.name, category.description]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function matchesSearch(listing: ListingWithSeller, query: string): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return true

  const haystack = listingHaystack(listing)
  const categoryHit = MARKETPLACE_CATEGORIES.some((category) => {
    if (!category.matches(listing.category, listing.subcategory)) return false
    const label = `${category.id} ${category.name} ${category.description}`.toLowerCase()
    return terms.every((term) => label.includes(term))
  })

  return categoryHit || terms.every((term) => haystack.includes(term))
}
