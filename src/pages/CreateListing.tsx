import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, CITIES, CONDITIONS, SUBCATEGORIES, UNITS } from '../data/categories'
import { createListing, uploadListingImage } from '../lib/api'
import type { Category, Condition, Unit } from '../types'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function CreateListing() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('plastic')
  const [subcategory, setSubcategory] = useState(SUBCATEGORIES.plastic[0].value)
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState<Unit>('kg')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState<Condition>('scrap')
  const [city, setCity] = useState<string>(CITIES[0])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null)
      return
    }
    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  const onImageChange = (file: File | null) => {
    setError('')
    if (!file) {
      setImageFile(null)
      return
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image must be 5 MB or smaller.')
      return
    }
    setImageFile(file)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      let imageUrl: string | null = null
      if (imageFile) {
        try {
          imageUrl = await uploadListingImage(imageFile)
        } catch {
          imageUrl = null
        }
      }

      await createListing({
        title,
        description,
        category,
        subcategory,
        quantity: Number(quantity),
        unit,
        priceMmk: price.trim() === '' ? null : Number(price),
        condition,
        city,
        imageUrl,
      })
      navigate('/dashboard')
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === 'TimeoutError'
          ? 'Publishing timed out. Check you are logged in and try again.'
          : err instanceof Error
            ? err.message
            : 'Could not create listing.'
      setError(message)
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="page">
      <h1>List surplus</h1>
      <p className="lede">
        Post unused plastic or industrial material so another Myanmar business can use it.
      </p>
      <form
        className="form"
        onSubmit={(event) => void submit(event)}
        onInvalid={() => setError('Fill the required fields above, then publish again.')}
      >
        <label className="field">
          <span>Title</span>
          <input required value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <div className="form-row">
          <label className="field">
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => {
                const next = event.target.value as Category
                setCategory(next)
                setSubcategory(SUBCATEGORIES[next][0].value)
              }}
            >
              {CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Type</span>
            <select
              value={subcategory}
              onChange={(event) => setSubcategory(event.target.value)}
            >
              {SUBCATEGORIES[category].map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-row">
          <label className="field">
            <span>Quantity</span>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Unit</span>
            <select value={unit} onChange={(event) => setUnit(event.target.value as Unit)}>
              {UNITS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-row">
          <label className="field">
            <span>Price (MMK, optional)</span>
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              placeholder="Leave blank to contact for price"
              onChange={(event) => setPrice(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Condition</span>
            <select
              value={condition}
              onChange={(event) => setCondition(event.target.value as Condition)}
            >
              {CONDITIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          <span>Photo (optional)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => onImageChange(event.target.files?.[0] ?? null)}
          />
          <span className="muted">JPEG, PNG, or WebP up to 5 MB.</span>
        </label>
        {imagePreview ? (
          <img className="listing-upload-preview" src={imagePreview} alt="Selected listing preview" />
        ) : null}
        <label className="field">
          <span>City</span>
          <select value={city} onChange={(event) => setCity(event.target.value)}>
            {CITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? (imageFile ? 'Uploading & publishing…' : 'Publishing…') : 'Publish listing'}
        </button>
      </form>
    </main>
  )
}
