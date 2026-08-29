import { Link } from 'react-router-dom'
import { t, type LoopiLang } from '../../lib/loopi/copy'
import type { ChatAction } from '../../lib/loopi/engine'

export function QuickActions({
  lang,
  actions,
  disabled,
  onAction,
}: {
  lang: LoopiLang
  actions: ChatAction[]
  disabled: boolean
  onAction: (id: string) => void
}) {
  if (!actions.length) return null
  return (
    <div className="loopi-actions">
      {actions.map((action) => {
        const label = t(lang, action.labelKey)
        if (action.href) {
          return (
            <Link key={action.id} className="loopi-chip" to={action.href}>
              {label}
            </Link>
          )
        }
        return (
          <button
            key={action.id}
            type="button"
            className="loopi-chip"
            disabled={disabled}
            onClick={() => onAction(action.id)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
