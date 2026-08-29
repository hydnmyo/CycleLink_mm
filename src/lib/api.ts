import { SEED_LISTINGS } from '../data/seed'
import type {
  CreateInquiryInput,
  CreateListingInput,
  ListingWithSeller,
  SellerInquiry,
  UpdateListingInput,
} from '../types'

function jwtFromCookie(): string {
  if (typeof document === 'undefined') return ''
  const match = /(?:^|;\s*)nf_jwt=([^;]+)/.exec(document.cookie)
  if (match) return decodeURIComponent(match[1])
  try {
    for (const key of Object.keys(localStorage)) {
      const raw = localStorage.getItem(key)
      if (!raw || !raw.includes('access_token')) continue
      const parsed = JSON.parse(raw) as {
        access_token?: string
        token?: { access_token?: string }
      }
      const token = parsed.token?.access_token ?? parsed.access_token
      if (typeof token === 'string' && token.split('.').length === 3) return token
    }
  } catch {
    // Ignore storage access errors and continue without a token.
  }
  return ''
}

function authHeaders(json = true): HeadersInit {
  const token = jwtFromCookie()
  const headers: Record<string, string> = {}
  if (json) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

function requestInit(init: RequestInit = {}): RequestInit {
  return { credentials: 'include', signal: AbortSignal.timeout(45_000), ...init }
}

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string }
    return body.error ?? res.statusText
  } catch {
    return res.statusText
  }
}

export async function fetchListings(): Promise<ListingWithSeller[]> {
  try {
    const res = await fetch('/api/listings', requestInit())
    if (!res.ok) throw new Error(await readError(res))
    return (await res.json()) as ListingWithSeller[]
  } catch {
    return SEED_LISTINGS
  }
}

export async function fetchListing(id: number): Promise<ListingWithSeller | null> {
  try {
    const res = await fetch(`/api/listings/${id}`, requestInit())
    if (res.status === 404) return null
    if (!res.ok) throw new Error(await readError(res))
    return (await res.json()) as ListingWithSeller
  } catch {
    return SEED_LISTINGS.find((listing) => listing.id === id) ?? null
  }
}

export async function createListing(input: CreateListingInput): Promise<ListingWithSeller> {
  const headers = authHeaders()
  if (!('Authorization' in headers)) {
    throw new Error('You are not signed in. Log out, log in, then publish again.')
  }
  const res = await fetch('/api/listings', requestInit({
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  }))
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as ListingWithSeller
}

export async function createInquiry(input: CreateInquiryInput): Promise<void> {
  const res = await fetch('/api/inquiries', requestInit({
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  }))
  if (!res.ok) throw new Error(await readError(res))
}

export async function uploadListingImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/uploads', requestInit({
    method: 'POST',
    headers: authHeaders(false),
    body: form,
  }))
  if (!res.ok) throw new Error(await readError(res))
  const body = (await res.json()) as { url: string }
  return body.url
}

export async function fetchMyListings(): Promise<ListingWithSeller[]> {
  const res = await fetch('/api/me/listings', requestInit({ headers: authHeaders(false) }))
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as ListingWithSeller[]
}

export async function updateListing(
  id: number,
  input: UpdateListingInput,
): Promise<ListingWithSeller> {
  const res = await fetch(`/api/listings/${id}`, requestInit({
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(input),
  }))
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as ListingWithSeller
}

export async function fetchSellerInquiries(): Promise<SellerInquiry[]> {
  const res = await fetch('/api/inquiries', requestInit({ headers: authHeaders(false) }))
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as SellerInquiry[]
}
