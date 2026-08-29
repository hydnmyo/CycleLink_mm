import type { ListingWithSeller } from '../../../src/types'
import type { BusinessRow, ListingRow } from '../../../db/schema'
import type { Category, Condition, Unit } from '../../../src/types'

export function mapListing(
  listing: ListingRow,
  seller: Pick<BusinessRow, 'id' | 'name' | 'industry' | 'city' | 'email'>,
): ListingWithSeller {
  return {
    id: listing.id,
    businessId: listing.businessId,
    title: listing.title,
    description: listing.description,
    category: listing.category as Category,
    subcategory: listing.subcategory,
    quantity: Number(listing.quantity),
    unit: listing.unit as Unit,
    priceMmk: listing.priceMmk,
    condition: listing.condition as Condition,
    city: listing.city,
    createdAt: listing.createdAt?.toISOString() ?? new Date().toISOString(),
    seller: {
      id: seller.id,
      name: seller.name,
      industry: seller.industry,
      city: seller.city,
      email: seller.email,
    },
  }
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

export function errorJson(message: string, status: number) {
  return Response.json({ error: message }, { status })
}
