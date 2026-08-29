import type { Config } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { inquiries, listings } from '../../db/schema'
import { ensureBusiness } from './_shared/business'
import { errorJson, json } from './_shared/map'

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return errorJson('Method not allowed', 405)
  }

  const user = await getUser()
  if (!user) return errorJson('Unauthorized', 401)

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return errorJson('Invalid JSON body', 400)
  }

  const listingId = Number(body.listingId)
  const message = String(body.message ?? '').trim()

  if (!Number.isFinite(listingId) || listingId <= 0) {
    return errorJson('A valid listingId is required.', 422)
  }
  if (message.length < 8) {
    return errorJson('Message must be at least 8 characters.', 422)
  }

  try {
    const [listing] = await db.select().from(listings).where(eq(listings.id, listingId)).limit(1)
    if (!listing) return errorJson('Listing not found', 404)

    const buyer = await ensureBusiness(user)
    const [created] = await db
      .insert(inquiries)
      .values({
        listingId,
        buyerBusinessId: buyer.id,
        message,
      })
      .returning()

    return json({ id: created.id, listingId, createdAt: created.createdAt }, 201)
  } catch {
    return errorJson('Could not send inquiry. Database may not be ready yet.', 503)
  }
}

export const config: Config = {
  path: '/api/inquiries',
  method: 'POST',
}
