import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ImpactStats } from '../components/ImpactStats'
import { ListingCard } from '../components/ListingCard'
import { useAuth } from '../context/AuthProvider'
import { fetchListings } from '../lib/api'
import type { ListingWithSeller } from '../types'

export function Home() {
  const { user } = useAuth()
  const [listings, setListings] = useState<ListingWithSeller[]>([])

  useEffect(() => {
    void fetchListings().then(setListings)
  }, [])

  const featured = [...listings]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4)

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">B2B circular marketplace · Myanmar</p>
          <h1>Turn surplus into opportunity</h1>
          <p className="mm-line">ပိုလျှံကုန်ကြမ်းကို စွန့်ပစ်မည့်အစား စက်မှုကွင်းဆက်ထဲ ပြန်ထည့်ပါ။</p>
          <p className="lede">
            Factories and workshops list plastic scrap, metal offcuts, textiles, and unused parts.
            Other businesses buy the inputs they need locally — cutting waste, imports, and cost.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/browse">
              Browse listings
            </Link>
            <Link className="btn btn-ghost" to={user ? '/listings/new' : '/signup'}>
              List your surplus
            </Link>
            <Link className="btn btn-ghost" to="/wanted">
              See wanted materials
            </Link>
          </div>
        </div>
      </section>

      <ImpactStats listings={listings} />

      <div className="steps">
        <article className="card step">
          <span className="step-num">1</span>
          <h3>Register your business</h3>
          <p>Create a CycleLink account with company name, industry, and city.</p>
        </article>
        <article className="card step">
          <span className="step-num">2</span>
          <h3>List or search surplus</h3>
          <p>Sellers post quantity and price. Buyers filter by material and city.</p>
        </article>
        <article className="card step">
          <span className="step-num">3</span>
          <h3>Inquire and reuse</h3>
          <p>Send a business inquiry. Materials stay in use instead of landfill.</p>
        </article>
      </div>

      <div className="section-head">
        <h2>Featured surplus</h2>
        <Link to="/browse">See all listings</Link>
      </div>
      {featured.length ? (
        <div className="listing-grid">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <p className="empty">Loading listings…</p>
      )}
    </main>
  )
}
