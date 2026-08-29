import type { Handler } from '@netlify/functions'
import { businessFieldsFromMeta } from './_shared/business'

type SignupUser = {
  id?: string
  email?: string
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
}

function readUser(body: string | null): SignupUser | undefined {
  try {
    const payload = JSON.parse(body || '{}') as { user?: SignupUser }
    return payload.user
  } catch {
    return undefined
  }
}

async function seedBusiness(user: SignupUser) {
  if (!user.id) return
  const { eq } = await import('drizzle-orm')
  const { db } = await import('../../db')
  const { businesses } = await import('../../db/schema')
  const meta = user.user_metadata ?? {}

  const existing = await db
    .select()
    .from(businesses)
    .where(eq(businesses.identityUserId, user.id))
    .limit(1)

  if (existing[0]) return

  await db.insert(businesses).values({
    identityUserId: user.id,
    ...businessFieldsFromMeta(meta, { email: user.email }),
  })
}

const handler: Handler = async (event) => {
  const user = readUser(event.body)

  try {
    await seedBusiness(user ?? {})
  } catch {
    // Signup must still succeed if the database write fails.
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        ...(user?.app_metadata ?? {}),
        roles: ['business'],
      },
    }),
  }
}

export { handler }
