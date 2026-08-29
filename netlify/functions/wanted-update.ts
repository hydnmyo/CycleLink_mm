import type { Config, Context } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db'
import { wanted } from '../../db/schema'
import { ensureBusiness } from './_shared/business'
import { errorJson, json, mapWanted } from './_shared/map'

export default async (req: Request, context: Context) => {
  if (req.method !== 'PATCH') return errorJson('Method not allowed', 405)

  const user = await getUser()
  if (!user) return errorJson('Unauthorized', 401)

  const id = Number(context.params?.id)
  if (!Number.isInteger(id) || id <= 0) return errorJson('Invalid wanted id', 400)

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return errorJson('Invalid JSON body', 400)
  }

  const status = String(body.status ?? '')
  if (status !== 'active' && status !== 'filled') {
    return errorJson('Status must be active or filled.', 422)
  }

  try {
    const business = await ensureBusiness(user)
    const [updated] = await db
      .update(wanted)
      .set({ status })
      .where(and(eq(wanted.id, id), eq(wanted.businessId, business.id)))
      .returning()

    if (!updated) return errorJson('Wanted listing not found or not owned by you.', 404)
    return json(mapWanted(updated, business))
  } catch {
    return errorJson('Could not update wanted listing. Database may not be ready yet.', 503)
  }
}

export const config: Config = {
  path: '/api/wanted/:id',
  method: 'PATCH',
}
