import { and, eq, ne } from 'drizzle-orm'
import { db } from '../../../db'
import { listings, matchAlerts, wanted } from '../../../db/schema'
import type { ListingRow, WantedRow } from '../../../db/schema'

export function materialsMatch(
  listing: Pick<ListingRow, 'category' | 'subcategory' | 'city'>,
  need: Pick<WantedRow, 'category' | 'subcategory' | 'city'>,
) {
  return (
    listing.category === need.category &&
    listing.subcategory === need.subcategory &&
    listing.city === need.city
  )
}

async function insertAlert(
  recipientBusinessId: number,
  listingId: number,
  wantedId: number,
  kind: string,
) {
  try {
    await db.insert(matchAlerts).values({ recipientBusinessId, listingId, wantedId, kind })
  } catch {
    // Duplicate match alerts are ignored.
  }
}

export async function createAlertsForNewListing(listing: ListingRow) {
  const needs = await db.select().from(wanted).where(eq(wanted.status, 'active'))
  for (const need of needs) {
    if (need.businessId === listing.businessId) continue
    if (!materialsMatch(listing, need)) continue
    await insertAlert(need.businessId, listing.id, need.id, 'surplus_for_wanted')
    await insertAlert(listing.businessId, listing.id, need.id, 'wanted_for_surplus')
  }
}

export async function createAlertsForNewWanted(need: WantedRow) {
  const rows = await db
    .select()
    .from(listings)
    .where(and(eq(listings.status, 'active'), ne(listings.businessId, need.businessId)))

  for (const listing of rows) {
    if (!materialsMatch(listing, need)) continue
    await insertAlert(need.businessId, listing.id, need.id, 'surplus_for_wanted')
    await insertAlert(listing.businessId, listing.id, need.id, 'wanted_for_surplus')
  }
}
