import type { Config } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db'
import { businesses, inquiries, listings } from '../../db/schema'
import { ensureBusiness } from './_shared/business'
import { errorJson, json } from './_shared/map'

export default async (req: Request) => {
  if (req.method !== 'GET') return errorJson('Method not allowed', 405)

  const user = await getUser()
  if (!user) return errorJson('Unauthorized', 401)

  try {
    const seller = await ensureBusiness(user)
    const rows = await db
      .select({
        inquiry: inquiries,
        listing: { id: listings.id, title: listings.title },
        buyer: {
          id: businesses.id,
          name: businesses.name,
          city: businesses.city,
          email: businesses.email,
        },
      })
      .from(inquiries)
      .innerJoin(listings, eq(inquiries.listingId, listings.id))
      .innerJoin(businesses, eq(inquiries.buyerBusinessId, businesses.id))
      .where(eq(listings.businessId, seller.id))
      .orderBy(desc(inquiries.createdAt))

    return json(
      rows.map(({ inquiry, listing, buyer }) => ({
        id: inquiry.id,
        message: inquiry.message,
        createdAt: inquiry.createdAt?.toISOString() ?? new Date().toISOString(),
        listing,
        buyer,
      })),
    )
  } catch {
    return errorJson('Could not load inquiries. Database may not be ready yet.', 503)
  }
}

export const config: Config = {
  path: '/api/inquiries',
  method: 'GET',
}
