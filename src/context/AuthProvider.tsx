import {
  AuthError,
  MissingIdentityError,
  getUser,
  handleAuthCallback,
  login as identityLogin,
  logout as identityLogout,
  onAuthChange,
  signup as identitySignup,
  type User,
} from '@netlify/identity'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type SignupInput = {
  email: string
  password: string
  company: string
  industry: string
  city: string
  contactPerson: string
  phone: string
  registrationDocument: string
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  identityAvailable: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (input: SignupInput) => Promise<{ needsConfirm: boolean }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function displayName(user: User | null): string {
  const company = user?.userMetadata?.company
  if (typeof company === 'string' && company.trim()) return company
  return user?.name ?? user?.email ?? 'Account'
}

export function metaString(user: User | null, key: string): string {
  const value = user?.userMetadata?.[key]
  return typeof value === 'string' ? value.trim() : ''
}

export function displayCity(user: User | null): string {
  return metaString(user, 'city') || metaString(user, 'location') || 'Yangon'
}

export function displayIndustry(user: User | null): string {
  return metaString(user, 'industry') || 'Textiles'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [identityAvailable, setIdentityAvailable] = useState(true)

  useEffect(() => {
    let unsubscribe = () => {}

    ;(async () => {
      try {
        await handleAuthCallback()
        setUser(await getUser())
        setIdentityAvailable(true)
      } catch (error) {
        if (error instanceof MissingIdentityError) {
          setIdentityAvailable(false)
        }
      } finally {
        setLoading(false)
      }
    })()

    try {
      unsubscribe = onAuthChange((_event, currentUser) => {
        setUser(currentUser)
      })
    } catch (error) {
      if (error instanceof MissingIdentityError) {
        setIdentityAvailable(false)
      }
    }

    return () => unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      identityAvailable,
      login: async (email, password) => {
        const current = await identityLogin(email, password)
        setUser(current)
      },
      signup: async (input) => {
        const current = await identitySignup(input.email, input.password, {
          full_name: input.contactPerson || input.company,
          company: input.company,
          industry: input.industry,
          city: input.city,
          location: input.city,
          contact_person: input.contactPerson,
          phone: input.phone,
          registration_document: input.registrationDocument,
        })
        setUser(current)
        return { needsConfirm: !current.confirmedAt }
      },
      logout: async () => {
        await identityLogout()
        setUser(null)
      },
    }),
    [user, loading, identityAvailable],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function authMessage(error: unknown): string {
  if (error instanceof MissingIdentityError) {
    return 'Authentication is available after this site is deployed to Netlify.'
  }
  if (error instanceof AuthError) {
    if (error.status === 401) return 'Invalid email or password.'
    if (error.status === 403) return 'Signups are not allowed for this site.'
    if (error.status === 422) return error.message || 'Check your email and password and try again.'
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}
