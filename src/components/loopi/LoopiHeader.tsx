import { t, type LoopiLang } from '../../lib/loopi/copy'

export function LoopiHeader({
  lang,
  onLang,
  onRefresh,
  onClose,
}: {
  lang: LoopiLang
  onLang: (lang: LoopiLang) => void
  onRefresh: () => void
  onClose: () => void
}) {
  return (
    <header className="loopi-header">
      <img className="loopi-header-avatar" src="/loopi-assistant.png?v=3" alt="" width={48} height={56} />
      <div className="loopi-header-copy">
        <p className="loopi-header-title">Loopi</p>
        <p className="loopi-header-sub">{t(lang, 'subtitle')}</p>
      </div>
      <div className="loopi-header-tools">
        <div className="loopi-lang" role="group" aria-label={t(lang, 'language')}>
          <button
            type="button"
            className={lang === 'en' ? 'is-active' : undefined}
            aria-pressed={lang === 'en'}
            onClick={() => onLang('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={lang === 'my' ? 'is-active' : undefined}
            aria-pressed={lang === 'my'}
            onClick={() => onLang('my')}
          >
            မြန်မာ
          </button>
        </div>
        <button type="button" className="loopi-icon-btn" onClick={onRefresh} aria-label={t(lang, 'refresh')}>
          <RefreshIcon />
        </button>
        <button type="button" className="loopi-icon-btn" onClick={onClose} aria-label={t(lang, 'closePanel')}>
          <CloseIcon />
        </button>
      </div>
    </header>
  )
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12a8 8 0 0 1 13.66-5.66L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.66 5.66L4 16M4 20v-4h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
