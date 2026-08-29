import { getStore } from '@netlify/blobs'
import type { Config } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { errorJson, json } from './_shared/map'

const STORE = 'cyclelink-images'
const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp'])

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return errorJson('Method not allowed', 405)
  }

  const user = await getUser()
  if (!user) return errorJson('Unauthorized', 401)

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return errorJson('Expected multipart form data', 400)
  }

  const file = form.get('file')
  if (!(file instanceof File)) return errorJson('Missing file field', 422)
  if (!ALLOWED.has(file.type)) {
    return errorJson('Only JPEG, PNG, and WebP images are allowed.', 422)
  }
  if (file.size > MAX_BYTES) {
    return errorJson('Image must be 5 MB or smaller.', 422)
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const safeUserId = user.id.replace(/[^a-zA-Z0-9_-]/g, '_')
  const key = `${safeUserId}_${crypto.randomUUID()}.${ext}`

  try {
    const store = getStore(STORE)
    const data = await file.arrayBuffer()
    await store.set(key, data, {
      metadata: { contentType: file.type, userId: user.id },
    })
    return json({ key, url: `/api/uploads/${key}` }, 201)
  } catch {
    return errorJson('Image storage is not available yet.', 503)
  }
}

export const config: Config = {
  path: '/api/uploads',
  method: 'POST',
}
