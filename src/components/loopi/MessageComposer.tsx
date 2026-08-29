import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { t, type LoopiLang } from '../../lib/loopi/copy'

export function MessageComposer({
  lang,
  disabled,
  onSend,
}: {
  lang: LoopiLang
  disabled: boolean
  onSend: (text: string) => void
}) {
  const [value, setValue] = useState('')
  const empty = value.trim() === ''

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    if (empty || disabled) return
    onSend(value.trim())
    setValue('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form className="loopi-composer" onSubmit={submit}>
      <label className="loopi-sr-only" htmlFor="loopi-input">
        {t(lang, 'placeholder')}
      </label>
      <textarea
        id="loopi-input"
        rows={1}
        value={value}
        disabled={disabled}
        placeholder={t(lang, 'placeholder')}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <button type="submit" className="loopi-send" disabled={empty || disabled} aria-label={t(lang, 'send')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 12 20 4l-7.5 16-1.7-6.3L4 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  )
}
