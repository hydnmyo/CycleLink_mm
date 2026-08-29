import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PasswordField } from '../components/PasswordField'
import { authMessage, useAuth } from '../context/AuthProvider'

const ACCEPTED_DOCS = '.pdf,.jpg,.jpeg,.png,.webp'
const MAX_DOC_BYTES = 5 * 1024 * 1024

export function Signup() {
  const { signup, identityAvailable } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/dashboard'
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setInfo('')

    if (!documentFile) {
      setError('Please attach a business registration document.')
      return
    }
    if (documentFile.size > MAX_DOC_BYTES) {
      setError('Registration document must be 5 MB or smaller.')
      return
    }

    setPending(true)
    try {
      const result = await signup({
        email,
        password,
        company,
        industry,
        city: location,
        contactPerson,
        phone,
        registrationDocument: documentFile.name,
      })
      if (result.needsConfirm) {
        setInfo('Check your email to confirm the account, then log in.')
        return
      }
      navigate(next)
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
      <form className="form auth-form" onSubmit={(event) => void submit(event)}>
        <label className="field">
          <span>Business name</span>
          <input
            required
            name="company"
            autoComplete="organization"
            placeholder="Yangon Circular Plastics"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Industry</span>
          <input
            required
            name="industry"
            placeholder="Plastic recycling"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Location</span>
          <input
            required
            name="location"
            autoComplete="address-level2"
            placeholder="Hlaing Tharyar, Yangon"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Contact person</span>
          <input
            required
            name="contactPerson"
            autoComplete="name"
            placeholder="U Aung Myint"
            value={contactPerson}
            onChange={(event) => setContactPerson(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Business email</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Phone</span>
          <input
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="+95 9 xxx xxx xxx"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          minLength={8}
        />
        <div className="field">
          <label htmlFor="registration-document">Business registration document</label>
          <input
            required
            id="registration-document"
            className="file-input"
            type="file"
            name="registrationDocument"
            accept={ACCEPTED_DOCS}
            onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)}
          />
          <span className="field-hint">PDF or image, up to 5 MB</span>
        </div>
        {error ? <p className="error">{error}</p> : null}
        {info ? <p className="muted">{info}</p> : null}
        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={pending || !identityAvailable}
        >
          {pending ? 'Creating account…' : 'Create Business Account'}
        </button>
      </form>
      <p>
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </main>
  )
}
