import type { Config, Context } from '@netlify/functions'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db'
import { businesses, wanted } from '../../db/schema'
import { SEED_WANTED } from '../../src/data/seedWanted'
import { errorJson, json, mapWanted } from './_shared/map'

async function listActive() {
  const rows = await db
    .select({ need: wanted, buyer: businesses })
    .from(wanted)
    .innerJoin(businesses, eq(wanted.businessId, businesses.id))
    .where(eq(wanted.status, 'active'))
    .orderBy(desc(wanted.createdAt))

  return rows.map((row) => mapWanted(row.need, row.buyer))
}

async function getOne(id: number) {
  const [row] = await db
    .select({ need: wanted, buyer: businesses })
    .from(wanted)
    .innerJoin(businesses, eq(wanted.businessId, businesses.id))
    .where(eq(wanted.id, id))
    .limit(1)

  return row ? mapWanted(row.need, row.buyer) : null
}

export default async (req: Request, context: Context) => {
  if (req.method !== 'GET') return errorJson('Method not allowed', 405)

  const rawId = context.params?.id
  const id = rawId ? Number(rawId) : null

  try {
    if (id) {
      if (!Number.isFinite(id)) return errorJson('Invalid wanted id', 400)
      const need = await getOne(id)
      if (!need) return errorJson('Wanted listing not found', 404)
      return json(need)
    }
    return json(await listActive())
  } catch {
    if (id) {
      const need = SEED_WANTED.find((item) => item.id === id)
      if (!need) return errorJson('Wanted listing not found', 404)
      return json(need)
    }
    return json(SEED_WANTED.filter((item) => item.status === 'active'))
  }
}

export const config: Config = {
  path: ['/api/wanted', '/api/wanted/:id'],
  method: 'GET',
}
