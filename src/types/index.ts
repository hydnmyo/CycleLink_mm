export type Category = 'plastic' | 'industrial'
export type Unit = 'kg' | 'ton' | 'piece' | 'lot'
export type Condition = 'new' | 'used' | 'scrap'
export type ListingStatus = 'active' | 'sold'
export type WantedStatus = 'active' | 'filled'
export type PlasticSubcategory = 'PET' | 'HDPE' | 'PP' | 'film' | 'mixed'
export type IndustrialSubcategory = 'metal' | 'textile' | 'machinery' | 'other'

export interface Business {
  id: number
  identityUserId: string
  name: string
  industry: string
  city: string
  email: string
  contactPerson?: string | null
  phone?: string | null
  registrationDocument?: string | null
  createdAt: string
}

export interface Listing {
  id: number
  businessId: number
  title: string
  description: string
  category: Category
  subcategory: string
  quantity: number
  unit: Unit
  priceMmk: number | null
  condition: Condition
  city: string
  imageUrl: string | null
  status?: ListingStatus
  createdAt: string
}

export interface ListingWithSeller extends Listing {
  seller: Pick<Business, 'id' | 'name' | 'industry' | 'city' | 'email'>
}

export interface CreateListingInput {
  title: string
  description: string
  category: Category
  subcategory: string
  quantity: number
  unit: Unit
  priceMmk: number | null
  condition: Condition
  city: string
  imageUrl?: string | null
}

export interface CreateInquiryInput {
  listingId: number
  message: string
}

export interface UpdateListingInput {
  title?: string
  description?: string
  quantity?: number
  unit?: Unit
  priceMmk?: number | null
  condition?: Condition
  city?: string
  imageUrl?: string | null
  status?: ListingStatus
}

export interface SellerInquiry {
  id: number
  message: string
  createdAt: string
  listing: Pick<Listing, 'id' | 'title'>
  buyer: Pick<Business, 'id' | 'name' | 'city' | 'email'>
}

export interface Wanted {
  id: number
  businessId: number
  title: string
  description: string
  category: Category
  subcategory: string
  quantity: number
  unit: Unit
  city: string
  status: WantedStatus
  createdAt: string
}

export interface WantedWithBuyer extends Wanted {
  buyer: Pick<Business, 'id' | 'name' | 'industry' | 'city' | 'email'>
}

export interface CreateWantedInput {
  title: string
  description: string
  category: Category
  subcategory: string
  quantity: number
  unit: Unit
  city: string
}

export interface MatchAlert {
  id: number
  kind: 'surplus_for_wanted' | 'wanted_for_surplus'
  createdAt: string
  listing: Pick<Listing, 'id' | 'title' | 'city' | 'category' | 'subcategory'>
  wanted: Pick<Wanted, 'id' | 'title' | 'city' | 'category' | 'subcategory'>
}
