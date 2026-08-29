import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  displayCity,
  displayIndustry,
  displayName,
  metaString,
  useAuth,
} from '../context/AuthProvider'
import {
  DEMO_BUSINESS,
  DEMO_LISTINGS,
  dashboardImage,
  listingViews,
  type DashboardListing,
  type DashboardRequest,
} from '../data/dashboard'
import { fetchListings } from '../lib/api'
import { formatDate, formatMmk, formatQuantity } from '../lib/format'
import { formatUnitPrice } from '../lib/listingDisplay'
import type { ListingWithSeller } from '../types'

type Tab = 'listings' | 'requests' | 'transactions' | 'analytics' | 'profile' | 'edit'

const TABS: { id: Tab; label: string }[] = [
  { id: 'listings', label: 'My Listings' },
  { id: 'requests', label: 'Requests' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'analytics', label: 'Analytics' },
]

const mmk = new Intl.NumberFormat('en-MM')

export function Dashboard() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = parseTab(params.get('tab'))
  const [liveListings, setLiveListings] = useState<ListingWithSeller[]>([])
  const [soldIds, setSoldIds] = useState<number[]>([])
  const [requests, setRequests] = useState<DashboardRequest[]>([])
  const [savedNote, setSavedNote] = useState('')
  const [profileOverride, setProfileOverride] = useState<typeof DEMO_BUSINESS | null>(null)

  const profile = useMemo(() => {
    if (profileOverride) return profileOverride
    if (!user) return DEMO_BUSINESS
    return {
      name: displayName(user),
      city: displayCity(user),
      industry: displayIndustry(user),
      contactPerson: metaString(user, 'contact_person') || displayName(user),
      email: user.email ?? DEMO_BUSINESS.email,
      phone: metaString(user, 'phone') || DEMO_BUSINESS.phone,
      verified: true,
    }
  }, [profileOverride, user])

  useEffect(() => {
    void fetchListings().then(setLiveListings)
  }, [])

  const rows = useMemo(() => {
    if (!user) return []
    const company = displayName(user)
    const email = user.email ?? ''
    return liveListings
      .filter((listing) => listing.seller.name === company || listing.seller.email === email)
      .map(toDashboardListing)
  }, [liveListings, user])

  const activeRows = rows.filter((row) => !soldIds.includes(row.id))
  const soldRows = rows.filter((row) => soldIds.includes(row.id))
  const pendingCount = requests.filter((request) => request.status === 'pending').length
  const completedCount = soldRows.length
  const recovered = soldRows.reduce((sum, row) => sum + row.revenueMmk, 0)

  const setTab = (next: Tab) => {
    setSavedNote('')
    setParams(next === 'listings' ? {} : { tab: next }, { replace: true })
  }

  const markSold = (id: number) => {
    setSoldIds((current) => (current.includes(id) ? current : [...current, id]))
  }

  const resolveRequest = (id: string, status: DashboardRequest['status']) => {
    setRequests((current) =>
      current.map((request) => (request.id === id ? { ...request, status } : request)),
    )
  }

  return (
    <main className="dashboard">
      <div className="dashboard-wrap">
        <header className="dashboard-head">
          <div>
            <h1>{profile.name}</h1>
            <p className="dashboard-sub">
              Business dashboard · Verified supplier · {profile.city}
            </p>
          </div>
          <div className="dashboard-actions">
            <button className="dash-btn" type="button" onClick={() => setTab('profile')}>
              <UserIcon />
              View Profile
            </button>
            <button className="dash-btn" type="button" onClick={() => setTab('analytics')}>
              <ChartIcon />
              View Analytics
            </button>
            <button className="dash-btn" type="button" onClick={() => setTab('edit')}>
              <EditIcon />
              Edit Profile
            </button>
            <Link className="dash-btn dash-btn-primary" to="/listings/new">
              <PlusIcon />
              Post Surplus Material
            </Link>
          </div>
        </header>

        <section className="dashboard-metrics" aria-label="Business totals">
          <MetricCard value={String(activeRows.length)} label="Active Listings" />
          <MetricCard value={String(pendingCount)} label="Pending Requests" />
          <MetricCard value={String(completedCount)} label="Completed Deals" />
          <MetricCard value={`${mmk.format(recovered)} MMK`} label="Revenue Recovered" />
        </section>

        {tab !== 'profile' && tab !== 'edit' ? (
          <nav className="dash-tabs" aria-label="Dashboard sections">
            {TABS.map((item) => (
              <button
                key={item.id}
                className={item.id === tab ? 'dash-tab is-active' : 'dash-tab'}
                type="button"
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        ) : null}

        {tab === 'listings' ? (
          <section className="dash-list">
            {activeRows.length === 0 ? (
              <p className="dash-empty">No active listings. Post surplus material to get started.</p>
            ) : (
              activeRows.map((listing) => (
                <article key={listing.id} className="dash-listing">
                  <img src={listing.image} alt="" />
                  <div className="dash-listing-copy">
                    <h2>{listing.title}</h2>
                    <p>
                      {listing.quantityLabel} · {listing.priceLabel} · {mmk.format(listing.views)}{' '}
                      views
                    </p>
                  </div>
                  <span className="dash-status">Active</span>
                  <div className="dash-listing-actions">
                    <Link className="dash-mini" to={`/listings/${listing.id}`}>
                      View
                    </Link>
                    <button className="dash-mini" type="button" onClick={() => markSold(listing.id)}>
                      Mark Sold
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        ) : null}

        {tab === 'requests' ? (
          <section className="dash-panel-list">
            {requests.length === 0 ? (
              <p className="dash-empty">No buyer requests yet. They will appear here after a firm inquires.</p>
            ) : null}
            {requests.map((request) => (
              <article key={request.id} className="dash-panel-card">
                <div>
                  <h2>{request.listingTitle}</h2>
                  <p className="muted">
                    {request.buyer} · {formatDate(`${request.createdAt}T00:00:00.000Z`)}
                  </p>
                  <p>{request.message}</p>
                </div>
                <div className="dash-listing-actions">
                  <span className={request.status === 'pending' ? 'dash-status' : 'dash-status is-sold'}>
                    {request.status === 'pending' ? 'Pending' : request.status}
                  </span>
                  {request.status === 'pending' ? (
                    <>
                      <button
                        className="dash-mini"
                        type="button"
                        onClick={() => resolveRequest(request.id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="dash-mini"
                        type="button"
                        onClick={() => resolveRequest(request.id, 'declined')}
                      >
                        Decline
                      </button>
                    </>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {tab === 'transactions' ? (
          <section className="dash-panel-list">
            {soldRows.length === 0 ? (
              <p className="dash-empty">No completed deals yet. Mark a listing as sold to record one.</p>
            ) : null}
            {soldRows.map((listing) => (
              <article key={listing.id} className="dash-panel-card">
                <div>
                  <h2>{listing.title}</h2>
                  <p className="muted">Marked sold on this dashboard</p>
                </div>
                <strong className="dash-amount">{formatMmk(listing.revenueMmk)}</strong>
              </article>
            ))}
          </section>
        ) : null}

        {tab === 'analytics' ? (
          <section className="dash-panel-list">
            {rows.length === 0 ? (
              <p className="dash-empty">Analytics appear after you post a surplus listing.</p>
            ) : (
            <article className="dash-panel-card dash-analytics">
              <h2>Listing views</h2>
              <ul className="dash-bars">
                {rows.map((listing) => {
                  const max = Math.max(...rows.map((item) => item.views), 1)
                  return (
                    <li key={listing.id}>
                      <span>{listing.title}</span>
                      <div className="dash-bar">
                        <span style={{ width: `${Math.round((listing.views / max) * 100)}%` }} />
                      </div>
                      <strong>{mmk.format(listing.views)}</strong>
                    </li>
                  )
                })}
              </ul>
            </article>
            )}
          </section>
        ) : null}

        {tab === 'profile' ? (
          <section className="dash-profile">
            <button className="dash-back" type="button" onClick={() => setTab('listings')}>
              Back to listings
            </button>
            <h2>Business profile</h2>
            <dl className="dash-dl">
              <div>
                <dt>Business name</dt>
                <dd>{profile.name}</dd>
              </div>
              <div>
                <dt>Industry</dt>
                <dd>{profile.industry}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{profile.city}</dd>
              </div>
              <div>
                <dt>Contact person</dt>
                <dd>{profile.contactPerson}</dd>
              </div>
              <div>
                <dt>Business email</dt>
                <dd>{profile.email}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{profile.phone}</dd>
              </div>
            </dl>
          </section>
        ) : null}

        {tab === 'edit' ? (
          <section className="dash-profile">
            <button className="dash-back" type="button" onClick={() => setTab('listings')}>
              Back to listings
            </button>
            <h2>Edit profile</h2>
            <ProfileForm
              initial={profile}
              savedNote={savedNote}
              onSave={(next) => {
                setProfileOverride({ ...next, verified: true })
                setSavedNote('Profile details updated on this dashboard.')
              }}
            />
          </section>
        ) : null}
      </div>
    </main>
  )
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <article className="metric-card">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </article>
  )
}

function ProfileForm({
  initial,
  savedNote,
  onSave,
}: {
  initial: typeof DEMO_BUSINESS
  savedNote: string
  onSave: (next: typeof DEMO_BUSINESS) => void
}) {
  const [name, setName] = useState(initial.name)
  const [industry, setIndustry] = useState(initial.industry)
  const [city, setCity] = useState(initial.city)
  const [contactPerson, setContactPerson] = useState(initial.contactPerson)
  const [email, setEmail] = useState(initial.email)
  const [phone, setPhone] = useState(initial.phone)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave({ name, industry, city, contactPerson, email, phone, verified: true })
  }

  return (
    <form className="form auth-form" onSubmit={submit}>
      <label className="field">
        <span>Business name</span>
        <input required value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="field">
        <span>Industry</span>
        <input required value={industry} onChange={(event) => setIndustry(event.target.value)} />
      </label>
      <label className="field">
        <span>Location</span>
        <input required value={city} onChange={(event) => setCity(event.target.value)} />
      </label>
      <label className="field">
        <span>Contact person</span>
        <input
          required
          value={contactPerson}
          onChange={(event) => setContactPerson(event.target.value)}
        />
      </label>
      <label className="field">
        <span>Business email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="field">
        <span>Phone</span>
        <input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
      </label>
      {savedNote ? <p className="muted">{savedNote}</p> : null}
      <button className="btn btn-primary btn-block" type="submit">
        Save changes
      </button>
    </form>
  )
}

function toDashboardListing(listing: ListingWithSeller): DashboardListing {
  const demo = DEMO_LISTINGS.find((item) => item.id === listing.id)
  if (demo) return demo
  return {
    id: listing.id,
    title: listing.title,
    quantityLabel: formatQuantity(listing.quantity, listing.unit),
    priceLabel: formatUnitPrice(listing),
    views: listingViews(listing.id),
    image: dashboardImage(listing),
    revenueMmk: listing.priceMmk ?? 0,
  }
}

function parseTab(value: string | null): Tab {
  if (
    value === 'requests' ||
    value === 'transactions' ||
    value === 'analytics' ||
    value === 'profile' ||
    value === 'edit'
  ) {
    return value
  }
  return 'listings'
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}