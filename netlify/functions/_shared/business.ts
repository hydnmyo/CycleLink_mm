import { eq } from 'drizzle-orm'
import type { User } from '@netlify/identity'
import { db } from '../../../db'
import { businesses } from '../../../db/schema'

export async function ensureBusiness(user: User) {
  const existing = await db
    .select()
    .from(businesses)
    .where(eq(businesses.identityUserId, user.id))
    .limit(1)

  if (existing[0]) return existing[0]

  const meta = user.userMetadata ?? {}
  const name = String(meta.company ?? user.name ?? 'Unnamed business')
  const industry = String(meta.industry ?? 'Other')
  const city = String(meta.city ?? 'Yangon')
  const email = user.email ?? ''

  const [created] = await db
    .insert(businesses)
    .values({
      identityUserId: user.id,
      name,
      industry,
      city,
      email,
    })
    .returning()

  return created
}
