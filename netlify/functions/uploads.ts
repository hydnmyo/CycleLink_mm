import { getStore } from '@netlify/blobs'
import type { Config } from '@netlify/functions'
import { userFromRequest } from './_shared/auth'
import { errorJson, json } from './_shared/map'

const STORE = 'cyclelink-images'
const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp'])

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return errorJson('Method not allowed', 405)
  }

  const user = await userFromRequest(req)
  if (!user) return errorJson('Unauthorized. Log in again.', 401)

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return errorJson('Expected multipart form data', 400)
  }

  const file = form.get('file')
  if (!(file instanceof Blob) || file.size === 0) return errorJson('Missing file field', 422)
  const contentType = file.type || 'image/jpeg'
  if (!ALLOWED.has(contentType)) {
    return errorJson('Only JPEG, PNG, and WebP images are allowed.', 422)
  }
  if (file.size > MAX_BYTES) {
    return errorJson('Image must be 5 MB or smaller.', 422)
  }

  const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg'
  const safeUserId = user.id.replace(/[^a-zA-Z0-9_-]/g, '_')
  const key = `${safeUserId}_${crypto.randomUUID()}.${ext}`

  try {
    const store = getStore({ name: STORE, consistency: 'strong' })
    const data = await file.arrayBuffer()
    await store.set(key, data, {
      metadata: { contentType, userId: user.id },
    })
    return json({ key, url: `/api/uploads/${key}` }, 201)
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Image storage is not available yet.'
    return errorJson(detail, 503)
  }
}

export const config: Config = {
  path: '/api/uploads',
  method: 'POST',
}
