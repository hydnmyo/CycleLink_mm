import type { User } from '@netlify/identity'
import { getUser } from '@netlify/identity'

type IdentityCtx = {
  url?: string
  token?: string
  user?: Record<string, unknown>
}

function readCookie(header: string, name: string): string {
  const match = new RegExp(`(?:^|;\\s*)${name}=([^;]+)`).exec(header)
  return match ? decodeURIComponent(match[1]) : ''
}

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}

export function tokenFromRequest(req: Request): string {
  const auth = req.headers.get('authorization') ?? ''
  const bearer = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : ''
  return bearer || readCookie(req.headers.get('cookie') ?? '', 'nf_jwt')
}

export function userFromToken(token: string): User | null {
  const claims = decodeJwt(token)
  const id = typeof claims?.sub === 'string' ? claims.sub : ''
  if (!claims || !id) return null
  const userMetadata = (claims.user_metadata ?? {}) as Record<string, unknown>
  const appMetadata = (claims.app_metadata ?? {}) as Record<string, unknown>
  const name = userMetadata.full_name ?? userMetadata.company ?? userMetadata.name
  return {
    id,
    email: typeof claims.email === 'string' ? claims.email : undefined,
    name: typeof name === 'string' ? name : undefined,
    userMetadata,
    appMetadata,
  }
}

/** Make getUser() see the JWT from this request (cookie or Authorization). */
export function applyIdentityFromRequest(req: Request) {
  const token = tokenFromRequest(req)
  if (!token) return

  const global = globalThis as typeof globalThis & { netlifyIdentityContext?: IdentityCtx }
  global.netlifyIdentityContext = {
    ...global.netlifyIdentityContext,
    url: global.netlifyIdentityContext?.url ?? new URL('/.netlify/identity', req.url).href,
    token,
    user: decodeJwt(token) ?? undefined,
  }
}

export async function userFromRequest(req: Request): Promise<User | null> {
  applyIdentityFromRequest(req)
  const fromSdk = await getUser()
  if (fromSdk?.id) return fromSdk
  return userFromToken(tokenFromRequest(req))
}
