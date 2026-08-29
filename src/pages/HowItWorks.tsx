import { Link } from 'react-router-dom'

export function HowItWorks() {
  return (
    <main className="page">
      <h1>How CycleLink works</h1>
      <p className="mm-line">ပတ်ဝန်းကျင်ထိခိုက်မှုကို လျှော့ချပြီး ပြည်တွင်းကုန်ကြမ်းရှားပါးမှုကို ဖြေရှင်းပါ။</p>
      <p className="lede">
        Energy waste, unused food and materials, pollution, and weak recycling habits hurt
        communities. In Myanmar, factories also struggle to find affordable local inputs. CycleLink
        is a B2B marketplace that treats surplus as inventory, not trash.
      </p>

      <div className="split" style={{ marginTop: 28 }}>
        <section className="panel stack">
          <h2>If you have surplus</h2>
          <p>1. Register with your business name, location, contact details, and registration document.</p>
          <p>2. List plastic scrap, metal, textiles, or unused machinery parts.</p>
          <p>3. Receive inquiries, and match alerts when a buyer posts a matching need.</p>
        </section>
        <section className="panel stack">
          <h2>If you need inputs</h2>
          <p>1. Browse public listings — no account required to look.</p>
          <p>2. Filter by material and city (Yangon, Mandalay, Bago, Thilawa SEZ).</p>
          <p>3. Post a wanted listing, or sign in and inquire. Matching surplus in the same city creates an alert.</p>
        </section>
      </div>

      <section className="panel stack" style={{ marginTop: 16 }}>
        <h2>Why this helps</h2>
        <p>
          <strong>Measure</strong> — the Impact page totals connected businesses, active listings,
          and surplus value kept in circulation.
        </p>
        <p>
          <strong>Reduce</strong> — surplus is reused as feedstock instead of dumped or burned.
        </p>
        <p>
          <strong>Prevent</strong> — matching happens before waste is generated at scale.
        </p>
        <p>
          <strong>Raise awareness</strong> — businesses see that another factory’s offcut can be
          their raw material.
        </p>
      </section>

      <div className="hero-actions" style={{ marginTop: 20 }}>
        <Link className="btn btn-primary" to="/browse">
          Browse listings
        </Link>
        <Link className="btn btn-ghost" to="/signup">
          Register a business
        </Link>
      </div>
    </main>
  )
}
