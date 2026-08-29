import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { createInquiry } from '../lib/api'

export function InquiryModal({
  listingId,
  listingTitle,
  onClose,
}: {
  listingId: number
  listingTitle: string
  onClose: () => void
}) {
  const { user, identityAvailable } = useAuth()
  const [message, setMessage] = useState(
    `We are interested in "${listingTitle}" and would like to discuss quantity, pickup, and price.`,
  )
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      await createInquiry({ listingId, message })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send inquiry.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby="inquiry-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="inquiry-title">Send inquiry</h2>
        {!identityAvailable ? (
          <p>Sign-in is available after this site is deployed to Netlify.</p>
        ) : !user ? (
          <p>
            <Link to={`/login?next=/listings/${listingId}`}>Sign in</Link> with your business
            account to inquire. Your company name and email come from your profile.
          </p>
        ) : done ? (
          <p>Inquiry sent. The seller can follow up using your registered business email.</p>
        ) : (
          <form className="stack" onSubmit={(event) => void submit(event)}>
            <label className="field">
              <span>Message</span>
              <textarea
                required
                minLength={8}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <div className="hero-actions">
              <button className="btn btn-primary" type="submit" disabled={pending}>
                {pending ? 'Sending…' : 'Send inquiry'}
              </button>
              <button className="btn btn-ghost" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        )}
        {done || !user || !identityAvailable ? (
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            Close
          </button>
        ) : null}
      </div>
    </div>
  )
}
