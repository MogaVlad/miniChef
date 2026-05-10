'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

interface AuthValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (fields: Partial<Pick<User, 'firstName' | 'lastName'>>) => Promise<{ success: boolean; error?: string }>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthValue | null>(null)

// --- localStorage mock auth ---

const LOCAL_USERS_KEY = 'mock_auth_users'
const LOCAL_SESSION_KEY = 'mock_auth_session'

interface StoredUser {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  createdAt: string
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]')
  } catch { return [] }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
}

function getSession(): string | null {
  return localStorage.getItem(LOCAL_SESSION_KEY)
}

function setSession(userId: string | null) {
  if (userId) localStorage.setItem(LOCAL_SESSION_KEY, userId)
  else localStorage.removeItem(LOCAL_SESSION_KEY)
}

function toUser(stored: StoredUser): User {
  return { id: stored.id, email: stored.email, firstName: stored.firstName, lastName: stored.lastName, createdAt: stored.createdAt }
}

function LocalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = getSession()
    if (sessionId) {
      const found = getStoredUsers().find(u => u.id === sessionId)
      if (found) setUser(toUser(found))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const users = getStoredUsers()
    const found = users.find(u => u.email === email)
    if (!found) return { success: false, error: 'No account found with this email.' }
    if (found.password !== password) return { success: false, error: 'Incorrect password.' }
    setSession(found.id)
    setUser(toUser(found))
    return { success: true }
  }, [])

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    const users = getStoredUsers()
    if (users.find(u => u.email === email)) return { success: false, error: 'An account with this email already exists.' }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email, password, firstName, lastName,
      createdAt: new Date().toISOString(),
    }
    saveStoredUsers([...users, newUser])
    setSession(newUser.id)
    setUser(toUser(newUser))
    return { success: true }
  }, [])

  const logout = useCallback(async () => {
    setSession(null)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (fields: Partial<Pick<User, 'firstName' | 'lastName'>>) => {
    if (!user) return { success: false, error: 'Not logged in.' }
    const users = getStoredUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return { success: false, error: 'User not found.' }
    if (fields.firstName !== undefined) users[idx].firstName = fields.firstName
    if (fields.lastName !== undefined) users[idx].lastName = fields.lastName
    saveStoredUsers(users)
    setUser(toUser(users[idx]))
    return { success: true }
  }, [user])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: 'Not logged in.' }
    const users = getStoredUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return { success: false, error: 'User not found.' }
    if (users[idx].password !== currentPassword) return { success: false, error: 'Current password is incorrect.' }
    users[idx].password = newPassword
    saveStoredUsers(users)
    return { success: true }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

// --- Supabase auth ---

async function fetchProfile(supaUser: SupabaseUser): Promise<User | null> {
  const { data } = await getSupabase()
    .from('profiles')
    .select('first_name, last_name, created_at')
    .eq('id', supaUser.id)
    .single()

  if (!data) return null
  return {
    id: supaUser.id,
    email: supaUser.email ?? '',
    firstName: data.first_name,
    lastName: data.last_name,
    createdAt: data.created_at,
  }
}

function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    getSupabase().auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user)
        setUser(profile)
      }
      setLoading(false)
    })

    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        return
      }
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfile(session.user)
        setUser(profile)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: error.message }
    if (data.user) {
      const profile = await fetchProfile(data.user)
      setUser(profile)
    }
    return { success: true }
  }, [])

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    })
    if (error) return { success: false, error: error.message }
    if (data.user && data.session) {
      const profile = await fetchProfile(data.user)
      setUser(profile)
    }
    return { success: true }
  }, [])

  const logout = useCallback(async () => {
    await getSupabase().auth.signOut()
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (fields: Partial<Pick<User, 'firstName' | 'lastName'>>) => {
    if (!user) return { success: false, error: 'Not logged in.' }

    const updates: Record<string, string> = {}
    if (fields.firstName !== undefined) updates.first_name = fields.firstName
    if (fields.lastName !== undefined) updates.last_name = fields.lastName

    const { error } = await getSupabase()
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) return { success: false, error: error.message }

    setUser(prev => prev ? {
      ...prev,
      firstName: fields.firstName ?? prev.firstName,
      lastName: fields.lastName ?? prev.lastName,
    } : null)
    return { success: true }
  }, [user])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: 'Not logged in.' }

    const { error: verifyError } = await getSupabase().auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })
    if (verifyError) return { success: false, error: 'Current password is incorrect.' }

    const { error } = await getSupabase().auth.updateUser({ password: newPassword })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
  }
  return <LocalAuthProvider>{children}</LocalAuthProvider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
