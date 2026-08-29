import { t, type LoopiLang } from '../../lib/loopi/copy'

export function LoopiPet({
  lang,
  onOpen,
}: {
  lang: LoopiLang
  onOpen: () => void
}) {
  return (
    <button type="button" className="loopi-pet" onClick={onOpen} aria-label={t(lang, 'openPet')}>
      <span className="loopi-pet-avatar">
        <img src="/loopi-assistant.png?v=3" alt="" width={132} height={154} />
      </span>
      <span className="loopi-pet-name">Loopi</span>
    </button>
  )
}
