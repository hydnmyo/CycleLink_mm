import type { ListingWithSeller, WantedStatus, WantedWithBuyer } from '../../../src/types'
import type { BusinessRow, ListingRow, WantedRow } from '../../../db/schema'
import type { Category, Condition, ListingStatus, Unit } from '../../../src/types'

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
    imageUrl: listing.imageUrl ?? null,
    status: listing.status as ListingStatus,
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

export function mapWanted(
  need: WantedRow,
  buyer: Pick<BusinessRow, 'id' | 'name' | 'industry' | 'city' | 'email'>,
): WantedWithBuyer {
  return {
    id: need.id,
    businessId: need.businessId,
    title: need.title,
    description: need.description,
    category: need.category as Category,
    subcategory: need.subcategory,
    quantity: Number(need.quantity),
    unit: need.unit as Unit,
    city: need.city,
    status: need.status as WantedStatus,
    createdAt: need.createdAt?.toISOString() ?? new Date().toISOString(),
    buyer: {
      id: buyer.id,
      name: buyer.name,
      industry: buyer.industry,
      city: buyer.city,
      email: buyer.email,
    },
  }
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

export function errorJson(message: string, status: number) {
  return Response.json({ error: message }, { status })
}
