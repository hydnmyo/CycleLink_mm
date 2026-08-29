import type { Config, Context } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { listings } from '../../db/schema'
import { errorJson, json, mapListing } from './_shared/map'
import { getOwnedListing } from './_shared/owner'

const UNITS = new Set(['kg', 'ton', 'piece', 'lot'])
const CONDITIONS = new Set(['new', 'used', 'scrap'])
const STATUSES = new Set(['active', 'sold'])

export default async (req: Request, context: Context) => {
  if (req.method !== 'PATCH') return errorJson('Method not allowed', 405)

  const user = await getUser()
  if (!user) return errorJson('Unauthorized', 401)

  const id = Number(context.params?.id)
  if (!Number.isInteger(id) || id <= 0) return errorJson('Invalid listing id', 400)

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return errorJson('Invalid JSON body', 400)
  }

  const updates: Partial<typeof listings.$inferInsert> = {}

  for (const field of ['title', 'description', 'city'] as const) {
    if (body[field] !== undefined) {
      const value = String(body[field]).trim()
      if (!value) return errorJson(`${field} cannot be empty.`, 422)
      updates[field] = value
    }
  }

  if (body.quantity !== undefined) {
    const quantity = Number(body.quantity)
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return errorJson('Quantity must be a positive number.', 422)
    }
    updates.quantity = quantity.toFixed(2)
  }

  if (body.priceMmk !== undefined) {
    const price = body.priceMmk === null || body.priceMmk === '' ? null : Number(body.priceMmk)
    if (price !== null && (!Number.isInteger(price) || price < 0)) {
      return errorJson('Price must be a non-negative whole number or null.', 422)
    }
    updates.priceMmk = price
  }

  if (body.unit !== undefined) {
    const unit = String(body.unit)
    if (!UNITS.has(unit)) return errorJson('Invalid unit.', 422)
    updates.unit = unit
  }

  if (body.condition !== undefined) {
    const condition = String(body.condition)
    if (!CONDITIONS.has(condition)) return errorJson('Invalid condition.', 422)
    updates.condition = condition
  }

  if (body.status !== undefined) {
    const status = String(body.status)
    if (!STATUSES.has(status)) return errorJson('Invalid listing status.', 422)
    updates.status = status
  }

  if (body.imageUrl !== undefined) {
    const imageUrl = body.imageUrl === null || body.imageUrl === '' ? null : String(body.imageUrl)
    if (imageUrl && !imageUrl.startsWith('/api/uploads/')) {
      return errorJson('Invalid image URL.', 422)
    }
    updates.imageUrl = imageUrl
  }

  if (Object.keys(updates).length === 0) return errorJson('No valid fields to update.', 422)

  try {
    const { business, listing } = await getOwnedListing(user, id)
    if (!listing) return errorJson('Listing not found or not owned by you.', 404)

    const [updated] = await db
      .update(listings)
      .set(updates)
      .where(eq(listings.id, listing.id))
      .returning()

    return json(mapListing(updated, business))
  } catch {
    return errorJson('Could not update listing. Database may not be ready yet.', 503)
  }
}

export const config: Config = {
  path: '/api/listings/:id',
  method: 'PATCH',
}
