import { getStore } from '@netlify/blobs'
import type { Config, Context } from '@netlify/functions'
import { errorJson } from './_shared/map'

const STORE = 'cyclelink-images'

export default async (_req: Request, context: Context) => {
  const key = context.params?.key
  if (!key) return errorJson('Missing key', 400)

  try {
    const store = getStore({ name: STORE, consistency: 'strong' })
    const result = await store.getWithMetadata(key, { type: 'arrayBuffer' })
    if (!result) return errorJson('Not found', 404)

    const contentType =
      typeof result.metadata.contentType === 'string'
        ? result.metadata.contentType
        : 'application/octet-stream'

    return new Response(result.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return errorJson('Image not available', 503)
  }
}

export const config: Config = {
  path: '/api/uploads/:key',
  method: 'GET',
}
