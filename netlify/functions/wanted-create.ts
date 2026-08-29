import type { Config } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { db } from '../../db'
import { wanted } from '../../db/schema'
import { ensureBusiness } from './_shared/business'
import { errorJson, json, mapWanted } from './_shared/map'
import { createAlertsForNewWanted } from './_shared/match'

const CATEGORIES = new Set(['plastic', 'industrial'])
const UNITS = new Set(['kg', 'ton', 'piece', 'lot'])

export default async (req: Request) => {
  if (req.method !== 'POST') return errorJson('Method not allowed', 405)

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
  const city = String(body.city ?? '').trim()

  if (!title || !description || !subcategory || !city) {
    return errorJson('Title, description, subcategory, and city are required.', 422)
  }
  if (!CATEGORIES.has(category) || !UNITS.has(unit)) {
    return errorJson('Invalid category or unit.', 422)
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return errorJson('Quantity must be a positive number.', 422)
  }

  try {
    const business = await ensureBusiness(user)
    const [created] = await db
      .insert(wanted)
      .values({
        businessId: business.id,
        title,
        description,
        category,
        subcategory,
        quantity: quantity.toFixed(2),
        unit,
        city,
      })
      .returning()

    try {
      await createAlertsForNewWanted(created)
    } catch {
      // Alerts are best-effort so posting demand still succeeds.
    }

    return json(mapWanted(created, business), 201)
  } catch {
    return errorJson('Could not save wanted listing. Database may not be ready yet.', 503)
  }
}

export const config: Config = {
  path: '/api/wanted',
  method: 'POST',
}
