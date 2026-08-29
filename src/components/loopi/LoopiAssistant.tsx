import { useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthProvider'
import { useLoopiAssistant } from '../../hooks/useLoopiAssistant'
import { t } from '../../lib/loopi/copy'
import { ChatMessage } from './ChatMessage'
import { LoopiHeader } from './LoopiHeader'
import { LoopiPet } from './LoopiPet'
import { MessageComposer } from './MessageComposer'

export function LoopiAssistant() {
  const { user } = useAuth()
  const loopi = useLoopiAssistant(Boolean(user))
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [loopi.state.messages, loopi.typing])

  useEffect(() => {
    if (!loopi.open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') loopi.setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [loopi.open, loopi.setOpen])

  return (
    <div className="loopi-root">
      {loopi.open ? (
        <section className="loopi-panel" role="dialog" aria-label="Loopi" aria-modal="false">
          <LoopiHeader
            lang={loopi.lang}
            onLang={loopi.setLang}
            onRefresh={() => loopi.setConfirmReset(true)}
            onClose={() => loopi.setOpen(false)}
          />
          {loopi.confirmReset ? (
            <div className="loopi-confirm" role="alertdialog" aria-labelledby="loopi-reset-title">
              <p id="loopi-reset-title">{t(loopi.lang, 'refreshTitle')}</p>
              <p>{t(loopi.lang, 'refreshBody')}</p>
              <div className="loopi-confirm-actions">
                <button type="button" className="btn btn-ghost" onClick={() => loopi.setConfirmReset(false)}>
                  {t(loopi.lang, 'refreshCancel')}
                </button>
                <button type="button" className="btn btn-primary" onClick={loopi.reset}>
                  {t(loopi.lang, 'refreshConfirm')}
                </button>
              </div>
            </div>
          ) : null}
          <div className="loopi-thread" ref={scroller}>
            {loopi.state.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                lang={loopi.lang}
                listings={loopi.listings}
                disabled={loopi.sending}
                onAction={(id) => loopi.applyEvent({ type: 'action', id })}
              />
            ))}
            {loopi.typing ? (
              <div className="loopi-row">
                <div className="loopi-bubble" aria-label={t(loopi.lang, 'typing')}>
                  <span className="loopi-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
            ) : null}
          </div>
          <MessageComposer
            lang={loopi.lang}
            disabled={loopi.sending}
            onSend={(text) => loopi.applyEvent({ type: 'text', text })}
          />
        </section>
      ) : (
        <LoopiPet lang={loopi.lang} onOpen={() => loopi.setOpen(true)} />
      )}
    </div>
  )
}
