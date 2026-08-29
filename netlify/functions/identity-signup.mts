import type { Handler } from '@netlify/functions'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { businesses } from '../../db/schema'
import { businessFieldsFromMeta } from './_shared/business'

const handler: Handler = async (event) => {
  const payload = JSON.parse(event.body || '{}') as {
    user?: {
      id?: string
      email?: string
      app_metadata?: Record<string, unknown>
      user_metadata?: Record<string, unknown>
    }
  }
  const user = payload.user
  const identityUserId = user?.id
  const meta = user?.user_metadata ?? {}

  if (identityUserId) {
    try {
      const existing = await db
        .select()
        .from(businesses)
        .where(eq(businesses.identityUserId, identityUserId))
        .limit(1)

      if (!existing[0]) {
        await db.insert(businesses).values({
          identityUserId,
          ...businessFieldsFromMeta(meta, { email: user?.email }),
        })
      }
    } catch {
      // Role assignment should still succeed if the database is not ready.
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        ...user?.app_metadata,
        roles: ['business'],
      },
    }),
  }
}

export { handler }
