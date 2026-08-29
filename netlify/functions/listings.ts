import type { Config, Context } from '@netlify/functions'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db'
import { businesses, listings } from '../../db/schema'
import { SEED_LISTINGS } from '../../src/data/seed'
import { errorJson, json, mapListing } from './_shared/map'

async function listAll() {
  const rows = await db
    .select({ listing: listings, seller: businesses })
    .from(listings)
    .innerJoin(businesses, eq(listings.businessId, businesses.id))
    .where(eq(listings.status, 'active'))
    .orderBy(desc(listings.createdAt))

  return rows.map((row) => mapListing(row.listing, row.seller))
}

async function getOne(id: number) {
  const [row] = await db
    .select({ listing: listings, seller: businesses })
    .from(listings)
    .innerJoin(businesses, eq(listings.businessId, businesses.id))
    .where(eq(listings.id, id))
    .limit(1)

  return row ? mapListing(row.listing, row.seller) : null
}

export default async (req: Request, context: Context) => {
  if (req.method !== 'GET') {
    return errorJson('Method not allowed', 405)
  }

  const rawId = context.params?.id
  const id = rawId ? Number(rawId) : null

  try {
    if (id) {
      if (!Number.isFinite(id)) return errorJson('Invalid listing id', 400)
      const listing = await getOne(id)
      if (!listing) return errorJson('Listing not found', 404)
      return json(listing)
    }

    return json(await listAll())
  } catch {
    if (id) {
      const listing = SEED_LISTINGS.find((item) => item.id === id)
      if (!listing) return errorJson('Listing not found', 404)
      return json(listing)
    }
    return json(SEED_LISTINGS.filter((listing) => listing.status !== 'sold'))
  }
}

export const config: Config = {
  path: ['/api/listings', '/api/listings/:id'],
  method: 'GET',
}
