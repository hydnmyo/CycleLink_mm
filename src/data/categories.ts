import type { Category, Condition, Unit } from '../types'

export const CITIES = ['Yangon', 'Mandalay', 'Bago', 'Thilawa SEZ'] as const

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'plastic', label: 'Plastic scrap & packaging' },
  { value: 'industrial', label: 'Industrial materials' },
]

export const SUBCATEGORIES: Record<Category, { value: string; label: string }[]> = {
  plastic: [
    { value: 'PET', label: 'PET' },
    { value: 'HDPE', label: 'HDPE' },
    { value: 'PP', label: 'PP' },
    { value: 'film', label: 'Film' },
    { value: 'mixed', label: 'Mixed plastic' },
  ],
  industrial: [
    { value: 'metal', label: 'Metal' },
    { value: 'textile', label: 'Textile' },
    { value: 'machinery', label: 'Machinery parts' },
    { value: 'other', label: 'Other' },
  ],
}

export const UNITS: { value: Unit; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'ton', label: 'ton' },
  { value: 'piece', label: 'piece' },
  { value: 'lot', label: 'lot' },
]

export const CONDITIONS: { value: Condition; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'scrap', label: 'Scrap' },
]

export const INDUSTRIES = [
  'Packaging',
  'Recycling',
  'Textiles',
  'Metal fabrication',
  'Machinery',
  'Plastic processing',
  'Manufacturing',
  'Other',
] as const
