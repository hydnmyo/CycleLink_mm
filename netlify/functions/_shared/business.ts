import { eq } from 'drizzle-orm'
import type { User } from '@netlify/identity'
import { db } from '../../../db'
import { businesses } from '../../../db/schema'

function optionalString(value: unknown) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

export function businessFieldsFromMeta(
  meta: Record<string, unknown>,
  fallbacks: { name?: string | null; email?: string | null },
) {
  return {
    name: String(meta.company ?? meta.full_name ?? fallbacks.name ?? 'Unnamed business'),
    industry: String(meta.industry ?? 'Other'),
    city: String(meta.city ?? meta.location ?? 'Yangon'),
    email: fallbacks.email ?? '',
    contactPerson: optionalString(meta.contact_person),
    phone: optionalString(meta.phone),
    registrationDocument: optionalString(meta.registration_document),
  }
}

export async function ensureBusiness(user: User) {
  const existing = await db
    .select()
    .from(businesses)
    .where(eq(businesses.identityUserId, user.id))
    .limit(1)

  if (existing[0]) return existing[0]

  const [created] = await db
    .insert(businesses)
    .values({
      identityUserId: user.id,
      ...businessFieldsFromMeta(user.userMetadata ?? {}, {
        name: user.name,
        email: user.email,
      }),
    })
    .returning()

  return created
}
