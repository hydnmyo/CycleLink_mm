import type { Config } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db'
import { listings, matchAlerts, wanted } from '../../db/schema'
import { ensureBusiness } from './_shared/business'
import { errorJson, json } from './_shared/map'

export default async (req: Request) => {
  if (req.method !== 'GET') return errorJson('Method not allowed', 405)

  const user = await getUser()
  if (!user) return errorJson('Unauthorized', 401)

  try {
    const business = await ensureBusiness(user)
    const rows = await db
      .select({
        alert: matchAlerts,
        listing: {
          id: listings.id,
          title: listings.title,
          city: listings.city,
          category: listings.category,
          subcategory: listings.subcategory,
        },
        need: {
          id: wanted.id,
          title: wanted.title,
          city: wanted.city,
          category: wanted.category,
          subcategory: wanted.subcategory,
        },
      })
      .from(matchAlerts)
      .innerJoin(listings, eq(matchAlerts.listingId, listings.id))
      .innerJoin(wanted, eq(matchAlerts.wantedId, wanted.id))
      .where(eq(matchAlerts.recipientBusinessId, business.id))
      .orderBy(desc(matchAlerts.createdAt))

    return json(
      rows.map(({ alert, listing, need }) => ({
        id: alert.id,
        kind: alert.kind,
        createdAt: alert.createdAt?.toISOString() ?? new Date().toISOString(),
        listing,
        wanted: need,
      })),
    )
  } catch {
    return errorJson('Could not load match alerts. Database may not be ready yet.', 503)
  }
}

export const config: Config = {
  path: '/api/alerts',
  method: 'GET',
}
