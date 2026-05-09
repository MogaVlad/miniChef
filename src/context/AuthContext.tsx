'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { getSupabase } from '@/lib/supabase'
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
