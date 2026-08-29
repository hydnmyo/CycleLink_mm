import { aggregateImpact, formatCo2e, formatKg } from '../../lib/impact'
import { hasCopyKey, t, type LoopiLang } from '../../lib/loopi/copy'
import type { ChatMessage as ChatMessageModel } from '../../lib/loopi/engine'
import type { ListingWithSeller } from '../../types'
import { ListingResultCard } from './ListingResultCard'
import { QuickActions } from './QuickActions'

export function ChatMessage({
  message,
  lang,
  listings,
  disabled,
  onAction,
}: {
  message: ChatMessageModel
  lang: LoopiLang
  listings: ListingWithSeller[]
  disabled: boolean
  onAction: (id: string) => void
}) {
  const mine = message.role === 'user'
  return (
    <div className={mine ? 'loopi-row is-user' : 'loopi-row'}>
      <div className={mine ? 'loopi-bubble is-user' : 'loopi-bubble'}>
        <MessageBody message={message} lang={lang} listings={listings} />
        {!mine ? (
          <QuickActions lang={lang} actions={message.actions} disabled={disabled} onAction={onAction} />
        ) : null}
      </div>
    </div>
  )
}

function MessageBody({
  message,
  lang,
  listings,
}: {
  message: ChatMessageModel
  lang: LoopiLang
  listings: ListingWithSeller[]
}) {
  const { body } = message
  if (body.type === 'plain') {
    return <p>{hasCopyKey(body.text) ? t(lang, body.text) : body.text}</p>
  }
  if (body.type === 'text' || body.type === 'estimate') {
    return <p className="loopi-pre">{t(lang, body.key, body.params)}</p>
  }
  if (body.type === 'impact') {
    const stats = aggregateImpact(listings)
    return (
      <div className="loopi-impact">
        <p>{t(lang, 'impactIntro')}</p>
        <p>
          <strong>{t(lang, 'impactDiverted')}:</strong> {formatKg(stats.totalKg)}
        </p>
        <p>
          <strong>{t(lang, 'impactCo2')}:</strong> {formatCo2e(stats.co2eKg)}
        </p>
        <p>{t(lang, 'impactSdgs')}</p>
      </div>
    )
  }
  const rows = body.listingIds
    .map((id) => listings.find((listing) => listing.id === id))
    .filter((listing): listing is ListingWithSeller => Boolean(listing))
  return (
    <div className="loopi-results">
      <p>{t(lang, body.empty ? 'noResults' : 'resultsIntro')}</p>
      {rows.map((listing) => (
        <ListingResultCard key={listing.id} listing={listing} lang={lang} />
      ))}
    </div>
  )
}
