import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, CITIES, SUBCATEGORIES, UNITS } from '../data/categories'
import { createWanted } from '../lib/api'
import type { Category, Unit } from '../types'

export function CreateWanted() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('plastic')
  const [subcategory, setSubcategory] = useState(SUBCATEGORIES.plastic[0].value)
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState<Unit>('kg')
  const [city, setCity] = useState<string>(CITIES[0])
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const need = await createWanted({
        title,
        description,
        category,
        subcategory,
        quantity: Number(quantity),
        unit,
        city,
      })
      navigate(`/wanted/${need.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not post wanted listing.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="page">
      <h1>Post a material need</h1>
      <p className="lede">
        Tell other businesses what feedstock you buy. Matching surplus in the same city and material
        type will create a match alert.
      </p>
      <form className="form" onSubmit={(event) => void submit(event)}>
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
            <select value={subcategory} onChange={(event) => setSubcategory(event.target.value)}>
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
            <span>Quantity needed</span>
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
          {pending ? 'Posting…' : 'Post wanted listing'}
        </button>
      </form>
    </main>
  )
}
