import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from './api'

export type Role = 'student' | 'moderator' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  university: string
  cleanUploadCount?: number
  isTrusted?: boolean
  trustThreshold?: number
}

export type StudyClass = {
  id: string
  name: string
  subject: string
  description: string
  noteCount?: number
}

export type NoteStatus = 'pending' | 'approved' | 'rejected'

export type Note = {
  id: string
  title: string
  description: string
  subject: string
  classId?: string | null
  tags?: string[]
  fileName?: string
  fileUrl?: string
  uploadedBy?: string
  uploadedByName?: string
  status: NoteStatus
  createdAt?: string
  reviewedAt?: string | null
}

export type ModeratorRequest = {
  id: string
  userId: string
  userName: string
  userEmail: string
  status: 'pending' | 'approved' | 'rejected'
  reason: string
  createdAt: string
}

export type Report = {
  id: string
  noteId: string
  noteTitle: string
  reportedByName: string
  reason: string
  status: 'open' | 'valid' | 'dismissed'
  createdAt: string
}

type AuthState = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (input: SignupInput) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

export type SignupInput = {
  name: string
  email: string
  password: string
  university: string
  role: 'student' | 'moderator'
  reason?: string
}

const AuthContext = createContext<AuthState | null>(null)

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('notevault_user')
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser)
  const [loading, setLoading] = useState(!!localStorage.getItem('notevault_token'))

  const persist = useCallback((token: string, nextUser: User) => {
    localStorage.setItem('notevault_token', token)
    localStorage.setItem('notevault_user', JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    api
      .get<{ user: User }>('/auth/me')
      .then((res) => {
        localStorage.setItem('notevault_user', JSON.stringify(res.data.user))
        setUser(res.data.user)
      })
      .catch(() => {
        localStorage.removeItem('notevault_token')
        localStorage.removeItem('notevault_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password })
      persist(res.data.token, res.data.user)
    },
    [persist],
  )

  const signup = useCallback(
    async (input: SignupInput) => {
      const res = await api.post<{ token: string; user: User }>('/auth/signup', input)
      persist(res.data.token, res.data.user)
    },
    [persist],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('notevault_token')
    localStorage.removeItem('notevault_user')
    setUser(null)
  }, [])

  const refresh = useCallback(async () => {
    const res = await api.get<{ user: User }>('/auth/me')
    localStorage.setItem('notevault_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, refresh }),
    [user, loading, login, signup, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
