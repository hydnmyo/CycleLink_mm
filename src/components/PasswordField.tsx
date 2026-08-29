import { useState } from 'react'

type PasswordFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  minLength?: number
}

export function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  minLength,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="field">
      <span>{label}</span>
      <div className="password-wrap">
        <input
          required
          type={visible ? 'text' : 'password'}
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          className="password-toggle"
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </label>
  )
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
      <path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.3 18.3 0 0 1-3.3 4.3" />
      <path d="M6.1 6.1A18 18 0 0 0 2 12s3.5 7 10 7a10.4 10.4 0 0 0 4.4-1" />
    </svg>
  )
}
