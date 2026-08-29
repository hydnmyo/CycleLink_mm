import type { Category } from '../types'

export function ListingImage({
  title,
  category,
  imageUrl,
  className = '',
}: {
  title: string
  category: Category
  imageUrl: string | null
  className?: string
}) {
  if (imageUrl) {
    return <img className={className} src={imageUrl} alt={title} loading="lazy" />
  }

  return (
    <div className={`listing-image-placeholder listing-image-placeholder-${category} ${className}`.trim()} aria-hidden="true">
      <span>{category === 'plastic' ? 'Plastic' : 'Industrial'}</span>
    </div>
  )
}
