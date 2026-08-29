import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CITIES, INDUSTRIES } from '../data/categories'
import { authMessage, useAuth } from '../context/AuthProvider'

export function Signup() {
  const { signup, identityAvailable } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState<string>(INDUSTRIES[0])
  const [city, setCity] = useState<string>(CITIES[0])
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setInfo('')
    setPending(true)
    try {
      const result = await signup({ email, password, company, industry, city })
      if (result.needsConfirm) {
        setInfo('Check your email to confirm the account, then log in.')
        return
      }
      navigate('/listings/new')
    } catch (err) {
      setError(authMessage(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="page auth-page">
      <h1>Create a business account</h1>
      <p className="lede">Register to list surplus or inquire on materials from other firms.</p>
      {!identityAvailable ? (
        <p className="error">Authentication works after you deploy this site to Netlify.</p>
      ) : null}
      <form className="form" onSubmit={(event) => void submit(event)}>
        <label className="field">
          <span>Company name</span>
          <input required value={company} onChange={(event) => setCompany(event.target.value)} />
        </label>
        <label className="field">
          <span>Work email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            required
            type="password"
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <div className="form-row">
          <label className="field">
            <span>Industry</span>
            <select value={industry} onChange={(event) => setIndustry(event.target.value)}>
              {INDUSTRIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
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
        </div>
        {error ? <p className="error">{error}</p> : null}
        {info ? <p className="muted">{info}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={pending || !identityAvailable}>
          {pending ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p>
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </main>
  )
}
