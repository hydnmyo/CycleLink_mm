import type { ListingWithSeller } from '../types'

export const DEMO_BUSINESS = {
  name: 'Green Stitch Textile',
  city: 'Yangon',
  industry: 'Textiles',
  contactPerson: 'Daw Su Hlaing',
  email: 'hello@greenstitch.mm',
  phone: '+95 9 250 441 220',
  verified: true,
}

export type DashboardListing = {
  id: number
  title: string
  quantityLabel: string
  priceLabel: string
  views: number
  image: string
  revenueMmk: number
}

export const DEMO_LISTINGS: DashboardListing[] = [
  {
    id: 16,
    title: 'Cotton Fabric Surplus',
    quantityLabel: '85 kg',
    priceLabel: '4,500 MMK/kg',
    views: 1240,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    revenueMmk: 382500,
  },
  {
    id: 17,
    title: 'Denim Offcuts',
    quantityLabel: '240 kg',
    priceLabel: '1,800 MMK/kg',
    views: 860,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
    revenueMmk: 432000,
  },
  {
    id: 18,
    title: 'Polyester Thread Cones',
    quantityLabel: '320 cones',
    priceLabel: '1,200 MMK/unit',
    views: 410,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db71132?w=400&q=80',
    revenueMmk: 384000,
  },
  {
    id: 19,
    title: 'Metal Zippers & Trims',
    quantityLabel: '6,400 pieces',
    priceLabel: '220 MMK/unit',
    views: 300,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80',
    revenueMmk: 1408000,
  },
]

export type DashboardRequest = {
  id: string
  buyer: string
  listingTitle: string
  message: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export const DEMO_REQUESTS: DashboardRequest[] = [
  {
    id: 'req-1',
    buyer: 'Ava Textile Mill',
    listingTitle: 'Denim Offcuts',
    message: 'Can take 80 kg this week if collection from Hlaing Tharyar is possible.',
    status: 'pending',
    createdAt: '2026-08-27',
  },
]

export type DashboardDeal = {
  id: string
  buyer: string
  listingTitle: string
  amountMmk: number
  date: string
}

export const DEMO_DEALS: DashboardDeal[] = [
  {
    id: 'deal-1',
    buyer: 'Hlaing Garment Works',
    listingTitle: 'Cotton remnant lot',
    amountMmk: 270000,
    date: '2026-08-20',
  },
]

const LISTING_IMAGES: Record<string, string> = {
  16: DEMO_LISTINGS[0].image,
  17: DEMO_LISTINGS[1].image,
  18: DEMO_LISTINGS[2].image,
  19: DEMO_LISTINGS[3].image,
}

export function dashboardImage(listing: ListingWithSeller): string {
  return LISTING_IMAGES[listing.id] ?? listingImageFallback(listing)
}

function listingImageFallback(listing: ListingWithSeller): string {
  if (listing.subcategory === 'textile') return DEMO_LISTINGS[0].image
  if (listing.subcategory === 'metal') return DEMO_LISTINGS[3].image
  return 'https://images.unsplash.com/photo-1586528116311-ad8dd90c14f7?w=400&q=80'
}

export function listingViews(id: number): number {
  const demo = DEMO_LISTINGS.find((item) => item.id === id)
  if (demo) return demo.views
  return 180 + ((id * 97) % 1600)
}
