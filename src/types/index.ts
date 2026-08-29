export type Category = 'plastic' | 'industrial'
export type Unit = 'kg' | 'ton' | 'piece' | 'lot'
export type Condition = 'new' | 'used' | 'scrap'
export type PlasticSubcategory = 'PET' | 'HDPE' | 'PP' | 'film' | 'mixed'
export type IndustrialSubcategory = 'metal' | 'textile' | 'machinery' | 'other'

export interface Business {
  id: number
  identityUserId: string
  name: string
  industry: string
  city: string
  email: string
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
}

export interface CreateInquiryInput {
  listingId: number
  message: string
}
