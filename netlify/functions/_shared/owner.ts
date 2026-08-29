import type { User } from '@netlify/identity'
import { and, eq } from 'drizzle-orm'
import { db } from '../../../db'
import { listings } from '../../../db/schema'
import { ensureBusiness } from './business'

export async function getOwnedListing(user: User, listingId: number) {
  const business = await ensureBusiness(user)
  const [listing] = await db
    .select()
    .from(listings)
    .where(and(eq(listings.id, listingId), eq(listings.businessId, business.id)))
    .limit(1)

  return { business, listing: listing ?? null }
}
