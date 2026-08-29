import { SEED_LISTINGS } from '../data/seed'
import { SEED_WANTED } from '../data/seedWanted'
import type {
  CreateInquiryInput,
  CreateListingInput,
  CreateWantedInput,
  ListingWithSeller,
  MatchAlert,
  SellerInquiry,
  UpdateListingInput,
  WantedStatus,
  WantedWithBuyer,
} from '../types'

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
    const res = await fetch('/api/listings')
    if (!res.ok) throw new Error(await readError(res))
    return (await res.json()) as ListingWithSeller[]
  } catch {
    return SEED_LISTINGS
  }
}

export async function fetchListing(id: number): Promise<ListingWithSeller | null> {
  try {
    const res = await fetch(`/api/listings/${id}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(await readError(res))
    return (await res.json()) as ListingWithSeller
  } catch {
    return SEED_LISTINGS.find((listing) => listing.id === id) ?? null
  }
}

export async function createListing(input: CreateListingInput): Promise<ListingWithSeller> {
  const res = await fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as ListingWithSeller
}

export async function createInquiry(input: CreateInquiryInput): Promise<void> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await readError(res))
}

export async function uploadListingImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/uploads', {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  if (!res.ok) throw new Error(await readError(res))
  const body = (await res.json()) as { url: string }
  return body.url
}

export async function fetchMyListings(): Promise<ListingWithSeller[]> {
  const res = await fetch('/api/me/listings', { credentials: 'include' })
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as ListingWithSeller[]
}

export async function updateListing(
  id: number,
  input: UpdateListingInput,
): Promise<ListingWithSeller> {
  const res = await fetch(`/api/listings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as ListingWithSeller
}

export async function fetchSellerInquiries(): Promise<SellerInquiry[]> {
  const res = await fetch('/api/inquiries', { credentials: 'include' })
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as SellerInquiry[]
}

export async function fetchWanted(): Promise<WantedWithBuyer[]> {
  try {
    const res = await fetch('/api/wanted')
    if (!res.ok) throw new Error(await readError(res))
    return (await res.json()) as WantedWithBuyer[]
  } catch {
    return SEED_WANTED.filter((item) => item.status === 'active')
  }
}

export async function fetchWantedItem(id: number): Promise<WantedWithBuyer | null> {
  try {
    const res = await fetch(`/api/wanted/${id}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(await readError(res))
    return (await res.json()) as WantedWithBuyer
  } catch {
    return SEED_WANTED.find((item) => item.id === id) ?? null
  }
}

export async function createWanted(input: CreateWantedInput): Promise<WantedWithBuyer> {
  const res = await fetch('/api/wanted', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as WantedWithBuyer
}

export async function updateWantedStatus(
  id: number,
  status: WantedStatus,
): Promise<WantedWithBuyer> {
  const res = await fetch(`/api/wanted/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as WantedWithBuyer
}

export async function fetchMatchAlerts(): Promise<MatchAlert[]> {
  const res = await fetch('/api/alerts', { credentials: 'include' })
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as MatchAlert[]
}
