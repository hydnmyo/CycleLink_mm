export interface MarketplaceCategory {
  id: string
  name: string
  description: string
  image: string
  matches: (category: string, subcategory: string) => boolean
}

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  {
    id: 'textile',
    name: 'Textile & Fabric',
    description: 'Fabric, denim, yarn, leather, thread, zippers, buttons',
    image: '/categories/textile.jpg',
    matches: (_, sub) => sub === 'textile',
  },
  {
    id: 'plastic',
    name: 'Plastic',
    description: 'Bottles, containers, packaging, plastic sheets, scraps',
    image: '/categories/plastic.jpg',
    matches: (cat) => cat === 'plastic',
  },
  {
    id: 'paper',
    name: 'Paper & Cardboard',
    description: 'Boxes, paper rolls, sheets, packaging, paper scraps',
    image: '/categories/paper.jpg',
    matches: () => false,
  },
  {
    id: 'metal',
    name: 'Metal',
    description: 'Aluminum, steel, metal sheets, wires, metal offcuts',
    image: '/categories/metal.jpg',
    matches: (_, sub) => sub === 'metal',
  },
  {
    id: 'wood',
    name: 'Wood',
    description: 'Timber, plywood, pallets, crates, wood offcuts',
    image: '/categories/wood.jpg',
    matches: () => false,
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Bottles, jars, containers, glass sheets',
    image: '/categories/glass.jpg',
    matches: () => false,
  },
  {
    id: 'rubber',
    name: 'Rubber',
    description: 'Rubber sheets, scraps, offcuts',
    image: '/categories/rubber.jpg',
    matches: () => false,
  },
  {
    id: 'construction',
    name: 'Construction',
    description: 'Tiles, pipes, plywood, building-material surplus',
    image: '/categories/construction.jpg',
    matches: () => false,
  },
  {
    id: 'components',
    name: 'Industrial Components',
    description: 'Fasteners, containers, accessories, production components',
    image: '/categories/components.jpg',
    matches: (_, sub) => sub === 'machinery',
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Other legitimate surplus or recyclable business materials',
    image: '/categories/other.jpg',
    matches: (_, sub) => sub === 'other',
  },
]

const LISTING_IMAGES: Record<string, string> = {
  textile: '/categories/textile.jpg',
  plastic: '/categories/plastic.jpg',
  metal: '/categories/metal.jpg',
  machinery: '/categories/components.jpg',
  paper: '/categories/paper.jpg',
  default: '/categories/other.jpg',
}

export function listingImage(category: string, subcategory: string): string {
  if (subcategory === 'textile') return LISTING_IMAGES.textile
  if (subcategory === 'metal') return LISTING_IMAGES.metal
  if (subcategory === 'machinery') return LISTING_IMAGES.machinery
  if (category === 'plastic') return LISTING_IMAGES.plastic
  return LISTING_IMAGES.default
}

export function displayCategoryName(category: string, subcategory: string): string {
  if (subcategory === 'textile') return 'Textile & Fabric'
  if (subcategory === 'metal') return 'Metal'
  if (subcategory === 'machinery') return 'Industrial Components'
  if (category === 'plastic') return 'Plastic'
  return 'Industrial'
}
