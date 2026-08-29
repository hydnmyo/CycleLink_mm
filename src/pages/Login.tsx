import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authMessage, useAuth } from '../context/AuthProvider'

export function Login() {
  const { login, identityAvailable } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/browse'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      await login(email, password)
      navigate(next)
    } catch (err) {
      setError(authMessage(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="page auth-page">
      <h1>Log in</h1>
      <p className="lede">Sign in with the email you used for your business account.</p>
      {!identityAvailable ? (
        <p className="error">Authentication works after you deploy this site to Netlify.</p>
      ) : null}
      <form className="form" onSubmit={(event) => void submit(event)}>
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
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={pending || !identityAvailable}>
          {pending ? 'Signing in…' : 'Log in'}
        </button>
      </form>
      <p>
        New to CycleLink? <Link to="/signup">Create a business account</Link>
      </p>
    </main>
  )
}
