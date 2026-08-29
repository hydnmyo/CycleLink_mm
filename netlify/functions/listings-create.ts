import type { Config } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { db } from '../../db'
import { listings } from '../../db/schema'
import { ensureBusiness } from './_shared/business'
import { errorJson, json, mapListing } from './_shared/map'

const CATEGORIES = new Set(['plastic', 'industrial'])
const UNITS = new Set(['kg', 'ton', 'piece', 'lot'])
const CONDITIONS = new Set(['new', 'used', 'scrap'])

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

  const title = String(body.title ?? '').trim()
  const description = String(body.description ?? '').trim()
  const category = String(body.category ?? '')
  const subcategory = String(body.subcategory ?? '').trim()
  const quantity = Number(body.quantity)
  const unit = String(body.unit ?? '')
  const condition = String(body.condition ?? '')
  const city = String(body.city ?? '').trim()
  const priceRaw = body.priceMmk
  const priceMmk =
    priceRaw === null || priceRaw === '' || priceRaw === undefined
      ? null
      : Number(priceRaw)

  if (!title || !description || !subcategory || !city) {
    return errorJson('Title, description, subcategory, and city are required.', 422)
  }
  if (!CATEGORIES.has(category) || !UNITS.has(unit) || !CONDITIONS.has(condition)) {
    return errorJson('Invalid category, unit, or condition.', 422)
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return errorJson('Quantity must be a positive number.', 422)
  }
  if (priceMmk != null && (!Number.isFinite(priceMmk) || priceMmk < 0)) {
    return errorJson('Price must be a positive number or empty.', 422)
  }

  try {
    const business = await ensureBusiness(user)
    const [created] = await db
      .insert(listings)
      .values({
        businessId: business.id,
        title,
        description,
        category,
        subcategory,
        quantity: quantity.toFixed(2),
        unit,
        priceMmk,
        condition,
        city,
      })
      .returning()

    return json(mapListing(created, business), 201)
  } catch {
    return errorJson('Could not save listing. Database may not be ready yet.', 503)
  }
}

export const config: Config = {
  path: '/api/listings',
  method: 'POST',
}
