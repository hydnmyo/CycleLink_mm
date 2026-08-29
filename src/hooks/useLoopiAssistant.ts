import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchListings } from '../lib/api'
import {
  handleLoopiEvent,
  welcomeState,
  type LoopiState,
} from '../lib/loopi/engine'
import type { LoopiLang } from '../lib/loopi/copy'
import type { ListingWithSeller } from '../types'

const STORAGE_KEY = 'cyclelink-loopi-session'

type Stored = {
  lang: LoopiLang
  state: LoopiState
}

function loadStored(): Stored | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Stored
  } catch {
    return null
  }
}

export function useLoopiAssistant(loggedIn: boolean) {
  const [open, setOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [lang, setLang] = useState<LoopiLang>(() => loadStored()?.lang ?? 'en')
  const [state, setState] = useState<LoopiState>(() => loadStored()?.state ?? welcomeState())
  const [listings, setListings] = useState<ListingWithSeller[]>([])
  const [typing, setTyping] = useState(false)
  const [sending, setSending] = useState(false)
  const sendingRef = useRef(false)
  const listingsRef = useRef(listings)
  listingsRef.current = listings
  const queue = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    void fetchListings().then(setListings)
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ lang, state }))
    } catch {
      /* ignore quota / private mode */
    }
  }, [lang, state])

  const applyEvent = useCallback(
    (event: { type: 'action'; id: string } | { type: 'text'; text: string }) => {
      if (sendingRef.current) return
      sendingRef.current = true
      setSending(true)
      setTyping(true)
      if (queue.current) clearTimeout(queue.current)
      queue.current = setTimeout(() => {
        setState((current) => handleLoopiEvent(current, event, listingsRef.current, loggedIn))
        setTyping(false)
        setSending(false)
        sendingRef.current = false
      }, 450)
    },
    [loggedIn],
  )

  const reset = useCallback(() => {
    setState(welcomeState())
    setConfirmReset(false)
    setTyping(false)
    setSending(false)
    sendingRef.current = false
  }, [])

  useEffect(() => {
    return () => {
      if (queue.current) clearTimeout(queue.current)
    }
  }, [])

  return {
    open,
    setOpen,
    confirmReset,
    setConfirmReset,
    lang,
    setLang,
    state,
    listings,
    typing,
    sending,
    applyEvent,
    reset,
  }
}
