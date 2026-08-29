import { CITIES } from '../../data/categories'
import { formatMmk } from '../format'
import type { Condition, ListingWithSeller } from '../../types'
import { MAIN_ACTIONS, MATERIAL_KINDS, type MaterialKind } from './copy'
import {
  cityFromText,
  detectMaterialFromText,
  estimatePriceMmkPerKg,
  parseBudgetInput,
  parseQuantityInput,
  searchListings,
} from './search'

export type LoopiStep =
  | 'welcome'
  | 'findCategory'
  | 'findLocation'
  | 'findQuantity'
  | 'findBudget'
  | 'create'
  | 'estimateCategory'
  | 'estimateCondition'
  | 'estimateQuantity'
  | 'estimateLocation'
  | 'track'
  | 'impact'
  | 'how'
  | 'support'

export type ChatAction = { id: string; labelKey: string; href?: string }

export type ChatBody =
  | { type: 'text'; key: string; params?: Record<string, string> }
  | { type: 'plain'; text: string }
  | { type: 'listings'; listingIds: number[]; empty: boolean }
  | { type: 'impact' }
  | { type: 'estimate'; key: string; params?: Record<string, string> }

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  body: ChatBody
  actions: ChatAction[]
}

export interface LoopiDraft {
  material?: MaterialKind
  city?: string | null
  minKg?: number | null
  quantityLabel?: string
  maxBudget?: number | null
  condition?: Condition
}

export interface LoopiState {
  step: LoopiStep
  draft: LoopiDraft
  messages: ChatMessage[]
}

export function welcomeState(): LoopiState {
  return {
    step: 'welcome',
    draft: {},
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        body: { type: 'text', key: 'welcome' },
        actions: MAIN_ACTIONS.map((id) => ({ id, labelKey: id })),
      },
    ],
  }
}

let seq = 1
function nid(): string {
  seq += 1
  return `m${seq}`
}

function assistant(body: ChatBody, actions: ChatAction[] = []): ChatMessage {
  return { id: nid(), role: 'assistant', body, actions }
}

function userPlain(text: string): ChatMessage {
  return { id: nid(), role: 'user', body: { type: 'plain', text }, actions: [] }
}

function backAction(): ChatAction {
  return { id: 'back', labelKey: 'back' }
}

function findLocationActions(): ChatAction[] {
  return [
    ...CITIES.map((city) => ({ id: `city:${city}`, labelKey: city })),
    { id: 'city:any', labelKey: 'anyLocation' },
    backAction(),
  ]
}

const CONDITIONS: Condition[] = ['new', 'used', 'scrap']

function materialActions(prefix: string): ChatAction[] {
  return [
    ...MATERIAL_KINDS.map((kind) => ({ id: `${prefix}:${kind}`, labelKey: kind })),
    backAction(),
  ]
}

function applyFindResults(listings: ListingWithSeller[], draft: LoopiDraft): ChatMessage {
  if (!draft.material) {
    return assistant({ type: 'text', key: 'askCategory' }, materialActions('material'))
  }
  const matches = searchListings(listings, {
    material: draft.material,
    city: draft.city ?? null,
    minKg: draft.minKg ?? null,
    maxBudget: draft.maxBudget ?? null,
  })
  if (!matches.length) {
    return assistant({ type: 'listings', listingIds: [], empty: true }, [
      { id: 'findMaterials', labelKey: 'changeFilters' },
      backAction(),
    ])
  }
  return assistant(
    { type: 'listings', listingIds: matches.map((item) => item.id), empty: false },
    [{ id: 'findMaterials', labelKey: 'changeFilters' }, backAction()],
  )
}

function finishEstimate(listings: ListingWithSeller[], draft: LoopiDraft): ChatMessage {
  if (!draft.material || !draft.condition || draft.minKg == null) {
    return assistant({ type: 'text', key: 'estimateInsufficient' }, [backAction()])
  }
  const estimate = estimatePriceMmkPerKg(listings, {
    material: draft.material,
    condition: draft.condition,
    city: draft.city ?? null,
  })
  if (!estimate) {
    return assistant({ type: 'text', key: 'estimateInsufficient' }, [backAction()])
  }
  const total = Math.round(estimate.mmkPerKg * draft.minKg)
  return assistant(
    {
      type: 'estimate',
      key: 'estimateResult',
      params: {
        count: String(estimate.count),
        price: formatMmk(Math.round(estimate.mmkPerKg)),
        total: formatMmk(total),
        qty: draft.quantityLabel ?? `${draft.minKg} kg`,
      },
    },
    [backAction()],
  )
}

function offTopic(): ChatMessage {
  return assistant({ type: 'text', key: 'offTopic' }, MAIN_ACTIONS.map((id) => ({ id, labelKey: id })))
}

function startFlow(action: string, loggedIn: boolean): { step: LoopiStep; message: ChatMessage } | null {
  switch (action) {
    case 'findMaterials':
      return {
        step: 'findCategory',
        message: assistant({ type: 'text', key: 'askCategory' }, materialActions('material')),
      }
    case 'createListing':
      return {
        step: 'create',
        message: assistant({ type: 'text', key: 'createGuide' }, [
          { id: 'open-form', labelKey: 'openForm', href: '/listings/new' },
          backAction(),
        ]),
      }
    case 'estimatePrice':
      return {
        step: 'estimateCategory',
        message: assistant({ type: 'text', key: 'estimateAskCategory' }, materialActions('est')),
      }
    case 'trackOrder':
      return {
        step: 'track',
        message: assistant(
          { type: 'text', key: loggedIn ? 'trackNone' : 'trackNeedLogin' },
          loggedIn
            ? [backAction()]
            : [{ id: 'open-login', labelKey: 'trackLogin', href: '/login' }, backAction()],
        ),
      }
    case 'impact':
      return {
        step: 'impact',
        message: assistant({ type: 'impact' }, [
          { id: 'open-impact', labelKey: 'impactOpen', href: '/impact' },
          backAction(),
        ]),
      }
    case 'howItWorks':
      return {
        step: 'how',
        message: assistant({ type: 'text', key: 'howSteps' }, [
          { id: 'open-how', labelKey: 'howOpen', href: '/how-it-works' },
          backAction(),
        ]),
      }
    case 'contactSupport':
      return {
        step: 'support',
        message: assistant({ type: 'text', key: 'supportText' }, [
          { id: 'open-browse', labelKey: 'browse', href: '/browse' },
          { id: 'open-how', labelKey: 'howOpen', href: '/how-it-works' },
          backAction(),
        ]),
      }
    default:
      return null
  }
}

function looksOnTopic(text: string): boolean {
  return /cyclelink|surplus|recycl|listing|plastic|metal|textile|material|waste|impact|inquiry|myanmar|ပိုလျှံ|ပြန်လည်|ပလတ်|သတ္တု|အထည်/.test(
    text.toLowerCase(),
  )
}

export function handleLoopiEvent(
  state: LoopiState,
  event: { type: 'action'; id: string } | { type: 'text'; text: string },
  listings: ListingWithSeller[],
  loggedIn: boolean,
): LoopiState {
  if (event.type === 'action' && event.id === 'back') {
    return {
      ...welcomeState(),
      messages: [...state.messages, assistant({ type: 'text', key: 'welcome' }, MAIN_ACTIONS.map((id) => ({ id, labelKey: id })))],
    }
  }

  if (event.type === 'action') {
    const started = startFlow(event.id, loggedIn)
    if (started) {
      const label = event.id
      return {
        step: started.step,
        draft: {},
        messages: [...state.messages, userPlain(label), started.message],
      }
    }

    if (event.id.startsWith('material:')) {
      const material = event.id.slice('material:'.length) as MaterialKind
      return {
        step: 'findLocation',
        draft: { material },
        messages: [
          ...state.messages,
          userPlain(material),
          assistant({ type: 'text', key: 'askLocation' }, findLocationActions()),
        ],
      }
    }

    if (event.id.startsWith('city:') && (state.step === 'findLocation' || state.step === 'findCategory')) {
      const token = event.id.slice('city:'.length)
      const city = token === 'any' ? null : token
      return {
        step: 'findQuantity',
        draft: { ...state.draft, city },
        messages: [
          ...state.messages,
          userPlain(token === 'any' ? 'anyLocation' : token),
          assistant({ type: 'text', key: 'askQuantity' }, [
            { id: 'qty:any', labelKey: 'skipQuantity' },
            backAction(),
          ]),
        ],
      }
    }

    if (event.id === 'qty:any') {
      return {
        step: 'findBudget',
        draft: { ...state.draft, minKg: null },
        messages: [
          ...state.messages,
          userPlain('skipQuantity'),
          assistant({ type: 'text', key: 'askBudget' }, [
            { id: 'budget:any', labelKey: 'skipBudget' },
            backAction(),
          ]),
        ],
      }
    }

    if (event.id === 'budget:any') {
      const draft = { ...state.draft, maxBudget: null }
      return {
        step: 'welcome',
        draft,
        messages: [...state.messages, userPlain('skipBudget'), applyFindResults(listings, draft)],
      }
    }

    if (event.id.startsWith('est:')) {
      const material = event.id.slice('est:'.length) as MaterialKind
      return {
        step: 'estimateCondition',
        draft: { material },
        messages: [
          ...state.messages,
          userPlain(material),
          assistant({ type: 'text', key: 'estimateAskCondition' }, [
            ...CONDITIONS.map((condition) => ({
              id: `cond:${condition}`,
              labelKey: condition === 'new' ? 'condNew' : condition === 'used' ? 'condUsed' : 'condScrap',
            })),
            backAction(),
          ]),
        ],
      }
    }

    if (event.id.startsWith('cond:')) {
      const condition = event.id.slice('cond:'.length) as Condition
      return {
        step: 'estimateQuantity',
        draft: { ...state.draft, condition },
        messages: [
          ...state.messages,
          userPlain(condition),
          assistant({ type: 'text', key: 'estimateAskQuantity' }, [backAction()]),
        ],
      }
    }

    if (event.id.startsWith('estcity:')) {
      const token = event.id.slice('estcity:'.length)
      const city = token === 'any' ? null : token
      const draft = { ...state.draft, city }
      return {
        step: 'welcome',
        draft,
        messages: [...state.messages, userPlain(token === 'any' ? 'anyLocation' : token), finishEstimate(listings, draft)],
      }
    }
  }

  const text = event.type === 'text' ? event.text.trim() : ''
  if (!text) return state

  const withUser = [...state.messages, userPlain(text)]

  if (state.step === 'findQuantity') {
    const parsed = parseQuantityInput(text)
    if (!parsed) {
      return {
        ...state,
        messages: [
          ...withUser,
          assistant({ type: 'text', key: 'parseQuantity' }, [
            { id: 'qty:any', labelKey: 'skipQuantity' },
            backAction(),
          ]),
        ],
      }
    }
    return {
      step: 'findBudget',
      draft: { ...state.draft, minKg: parsed.kg, quantityLabel: parsed.label },
      messages: [
        ...withUser,
        assistant({ type: 'text', key: 'askBudget' }, [
          { id: 'budget:any', labelKey: 'skipBudget' },
          backAction(),
        ]),
      ],
    }
  }

  if (state.step === 'findBudget') {
    const budget = parseBudgetInput(text)
    if (budget == null) {
      return {
        ...state,
        messages: [
          ...withUser,
          assistant({ type: 'text', key: 'parseBudget' }, [
            { id: 'budget:any', labelKey: 'skipBudget' },
            backAction(),
          ]),
        ],
      }
    }
    const draft = { ...state.draft, maxBudget: budget }
    return { step: 'welcome', draft, messages: [...withUser, applyFindResults(listings, draft)] }
  }

  if (state.step === 'findLocation') {
    const parsed = cityFromText(text)
    if (!parsed.matched) {
      return {
        ...state,
        messages: [...withUser, assistant({ type: 'text', key: 'askLocation' }, findLocationActions())],
      }
    }
    return {
      step: 'findQuantity',
      draft: { ...state.draft, city: parsed.city },
      messages: [
        ...withUser,
        assistant({ type: 'text', key: 'askQuantity' }, [
          { id: 'qty:any', labelKey: 'skipQuantity' },
          backAction(),
        ]),
      ],
    }
  }

  if (state.step === 'findCategory') {
    const material = detectMaterialFromText(text)
    if (!material) {
      return {
        ...state,
        messages: [...withUser, assistant({ type: 'text', key: 'askCategory' }, materialActions('material'))],
      }
    }
    return {
      step: 'findLocation',
      draft: { material },
      messages: [...withUser, assistant({ type: 'text', key: 'askLocation' }, findLocationActions())],
    }
  }

  if (state.step === 'estimateQuantity') {
    const parsed = parseQuantityInput(text)
    if (!parsed) {
      return {
        ...state,
        messages: [...withUser, assistant({ type: 'text', key: 'parseQuantity' }, [backAction()])],
      }
    }
    return {
      step: 'estimateLocation',
      draft: { ...state.draft, minKg: parsed.kg, quantityLabel: parsed.label },
      messages: [
        ...withUser,
        assistant({ type: 'text', key: 'estimateAskLocation' }, [
          ...CITIES.map((city) => ({ id: `estcity:${city}`, labelKey: city })),
          { id: 'estcity:any', labelKey: 'anyLocation' },
          backAction(),
        ]),
      ],
    }
  }

  if (state.step === 'estimateLocation') {
    const parsed = cityFromText(text)
    if (!parsed.matched) {
      return {
        ...state,
        messages: [
          ...withUser,
          assistant({ type: 'text', key: 'estimateAskLocation' }, [
            ...CITIES.map((city) => ({ id: `estcity:${city}`, labelKey: city })),
            { id: 'estcity:any', labelKey: 'anyLocation' },
            backAction(),
          ]),
        ],
      }
    }
    const draft = { ...state.draft, city: parsed.city }
    return { step: 'welcome', draft, messages: [...withUser, finishEstimate(listings, draft)] }
  }

  const started = startFlowFromText(text, loggedIn)
  if (started) {
    return {
      step: started.step,
      draft: {},
      messages: [...withUser, started.message],
    }
  }

  if (!looksOnTopic(text)) {
    return { ...state, step: 'welcome', messages: [...withUser, offTopic()] }
  }

  const material = detectMaterialFromText(text)
  if (material) {
    return {
      step: 'findLocation',
      draft: { material },
      messages: [...withUser, assistant({ type: 'text', key: 'askLocation' }, findLocationActions())],
    }
  }

  return { ...state, step: 'welcome', messages: [...withUser, offTopic()] }
}

function startFlowFromText(text: string, loggedIn: boolean) {
  const lower = text.toLowerCase()
  if (/find material|browse|ရှာ/.test(lower)) return startFlow('findMaterials', loggedIn)
  if (/create|list surplus|စာရင်းတင်/.test(lower)) return startFlow('createListing', loggedIn)
  if (/estimate|price|ဈေး/.test(lower)) return startFlow('estimatePrice', loggedIn)
  if (/track|order|အော်ဒါ/.test(lower)) return startFlow('trackOrder', loggedIn)
  if (/impact|co2|sdg|ထိခိုက်/.test(lower)) return startFlow('impact', loggedIn)
  if (/how (does|do|it)|အလုပ်လုပ်/.test(lower)) return startFlow('howItWorks', loggedIn)
  if (/support|contact|အကူအညီ/.test(lower)) return startFlow('contactSupport', loggedIn)
  return null
}

