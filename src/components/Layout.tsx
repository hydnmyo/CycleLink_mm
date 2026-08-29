import { NavLink, Outlet } from 'react-router-dom'
import { displayName, useAuth } from '../context/AuthProvider'

const links = [
  { to: '/browse', label: 'Browse' },
  { to: '/wanted', label: 'Wanted' },
  { to: '/impact', label: 'Impact' },
  { to: '/how-it-works', label: 'How it works' },
]

export function Layout() {
  const { user, loading, identityAvailable, logout } = useAuth()

  return (
    <div className="app-shell">
      {!identityAvailable && !loading ? (
        <div className="banner">
          Auth is live after a Netlify deploy. Browse and impact still work.
        </div>
      ) : null}
      <header className="site-header">
        <div className="header-inner">
          <NavLink className="brand" to="/">
            <span className="brand-mark">CL</span>
            CycleLink MM
          </NavLink>
          <nav className="nav-links" aria-label="Primary">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <span className="user-chip">{displayName(user)}</span>
                <NavLink className="btn btn-ghost" to="/my-listings">
                  My listings
                </NavLink>
                <NavLink className="btn btn-ghost" to="/inbox">
                  Inbox
                </NavLink>
                <NavLink className="btn btn-ghost" to="/alerts">
                  Alerts
                </NavLink>
                <NavLink className="btn btn-primary" to="/listings/new">
                  List surplus
                </NavLink>
                <button className="btn btn-ghost" type="button" onClick={() => void logout()}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-ghost" to="/login">
                  Log in
                </NavLink>
                <NavLink className="btn btn-primary" to="/signup">
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div className="footer-inner">
          <p>CycleLink MM — surplus stays in Myanmar’s industrial loop.</p>
          <p>စွန့်ပစ်ပစ္စည်းကို ကုန်ကြမ်းအဖြစ် ပြန်လည်ချိတ်ဆက်ပါ။</p>
        </div>
      </footer>
    </div>
  )
}
