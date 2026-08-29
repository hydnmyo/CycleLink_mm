import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { FeaturedListingCard } from '../components/FeaturedListingCard'
import { useAuth } from '../context/AuthProvider'
import { MARKETPLACE_CATEGORIES } from '../data/homeCategories'
import { fetchListings } from '../lib/api'
import type { ListingWithSeller } from '../types'

const HERO_BG = '/categories/other.jpg'

export function Home() {
  const { user } = useAuth()
  const [listings, setListings] = useState<ListingWithSeller[]>([])

  useEffect(() => {
    void fetchListings().then(setListings)
  }, [])

  const featured = useMemo(
    () =>
      [...listings]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 4),
    [listings],
  )

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const cat of MARKETPLACE_CATEGORIES) {
      counts.set(cat.id, 0)
    }
    for (const listing of listings) {
      for (const cat of MARKETPLACE_CATEGORIES) {
        if (cat.matches(listing.category, listing.subcategory)) {
          counts.set(cat.id, (counts.get(cat.id) ?? 0) + 1)
        }
      }
    }
    return counts
  }, [listings])

  return (
    <main className="home">
      <section className="home-hero" style={{ '--hero-bg': `url(${HERO_BG})` } as CSSProperties}>
        <div className="home-hero-inner">
          <span className="home-hero-badge">Circular B2B marketplace · Myanmar</span>
          <h1>Turn Surplus Into Opportunity.</h1>
          <p className="home-hero-lede">
            A circular B2B marketplace where businesses can sell surplus materials and find the
            resources they need.
          </p>
          <div className="home-hero-actions">
            <Link className="btn btn-hero-primary" to="/browse">
              Explore Materials
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link className="btn btn-hero-ghost" to={user ? '/dashboard' : '/signup'}>
              Sell Surplus
            </Link>
            <Link className="btn btn-hero-ghost" to="/how-it-works">
              Post What You Need
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section home-value">
        <div className="home-container">
          <div className="home-value-grid">
            <article className="home-value-card">
              <div className="home-value-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3>Businesses have surplus</h3>
              <p>
                Offcuts, excess inventory, packaging and recyclable material sitting idle in
                warehouses.
              </p>
            </article>
            <article className="home-value-card">
              <div className="home-value-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3>Other businesses need materials</h3>
              <p>
                Manufacturers, packers and builders looking for affordable, available production
                inputs.
              </p>
            </article>
            <article className="home-value-card">
              <div className="home-value-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <h3>We connect them</h3>
              <p>
                CycleLink matches supply with demand, then the platform tracks and verifies the
                deal.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section home-categories">
        <div className="home-container">
          <div className="home-section-head">
            <div>
              <p className="home-section-label">Marketplace Categories</p>
              <h2>Every industrial material stream.</h2>
            </div>
            <Link className="btn btn-outline" to="/browse">
              Browse marketplace
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="home-category-grid">
            {MARKETPLACE_CATEGORIES.map((cat) => {
              const count = categoryCounts.get(cat.id) ?? 0
              return (
                <Link key={cat.id} className="home-category-card" to={`/browse?category=${cat.id}`}>
                  <div className="home-category-image">
                    <img src={cat.image} alt={cat.name} loading="lazy" />
                  </div>
                  <div className="home-category-body">
                    <h3>{cat.name}</h3>
                    <p>{cat.description}</p>
                    <span className="home-category-count">
                      {count} listing{count === 1 ? '' : 's'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="home-section home-featured">
        <div className="home-container">
          <div className="home-section-head">
            <div>
              <p className="home-section-label">Featured Listings</p>
              <h2>Available surplus right now</h2>
            </div>
            <Link className="btn btn-outline" to="/browse">
              View all materials
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {featured.length ? (
            <div className="home-featured-grid">
              {featured.map((listing) => (
                <FeaturedListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="empty">Loading listings…</p>
          )}
        </div>
      </section>
    </main>
  )
}
