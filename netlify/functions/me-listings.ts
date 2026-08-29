import type { Config } from '@netlify/functions'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db'
import { listings } from '../../db/schema'
import { userFromRequest } from './_shared/auth'
import { ensureBusiness } from './_shared/business'
import { errorJson, json, mapListing } from './_shared/map'

export default async (req: Request) => {
  if (req.method !== 'GET') return errorJson('Method not allowed', 405)

  const user = await userFromRequest(req)
  if (!user) return errorJson('Unauthorized. Log in again.', 401)

  try {
    const business = await ensureBusiness(user)
    const rows = await db
      .select()
      .from(listings)
      .where(eq(listings.businessId, business.id))
      .orderBy(desc(listings.createdAt))

    return json(rows.map((listing) => mapListing(listing, business)))
  } catch {
    return errorJson('Could not load your listings. Database may not be ready yet.', 503)
  }
}

export const config: Config = {
  path: '/api/me/listings',
  method: 'GET',
}
