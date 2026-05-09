'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

interface StoredUser extends User {
  password: string
}

interface AuthValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (email: string, password: string, firstName: string, lastName: string) => { success: boolean; error?: string }
  logout: () => void
  updateProfile: (fields: Partial<Pick<User, 'firstName' | 'lastName'>>) => { success: boolean; error?: string }
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string }
}

const USERS_KEY = 'minichef_users'
const SESSION_KEY = 'minichef_session'

const AuthContext = createContext<AuthValue | null>(null)

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const sessionId = localStorage.getItem(SESSION_KEY)
      if (sessionId) {
        const users = getStoredUsers()
        const found = users.find(u => u.id === sessionId)
        if (found) {
          const { password: _, ...safeUser } = found
          setUser(safeUser)
        }
      }
    } catch {}
    setLoading(false)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const users = getStoredUsers()
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!found) return { success: false, error: 'No account found with this email.' }
    if (found.password !== password) return { success: false, error: 'Incorrect password.' }

    localStorage.setItem(SESSION_KEY, found.id)
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    return { success: true }
  }, [])

  const register = useCallback((email: string, password: string, firstName: string, lastName: string) => {
    const users = getStoredUsers()
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
      password,
      createdAt: new Date().toISOString(),
    }

    setStoredUsers([...users, newUser])
    localStorage.setItem(SESSION_KEY, newUser.id)
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback((fields: Partial<Pick<User, 'firstName' | 'lastName'>>) => {
    const sessionId = localStorage.getItem(SESSION_KEY)
    if (!sessionId) return { success: false, error: 'Not logged in.' }

    const users = getStoredUsers()
    const idx = users.findIndex(u => u.id === sessionId)
    if (idx === -1) return { success: false, error: 'User not found.' }

    users[idx] = { ...users[idx], ...fields }
    setStoredUsers(users)

    const { password: _, ...safeUser } = users[idx]
    setUser(safeUser)
    return { success: true }
  }, [])

  const changePassword = useCallback((currentPassword: string, newPassword: string) => {
    const sessionId = localStorage.getItem(SESSION_KEY)
    if (!sessionId) return { success: false, error: 'Not logged in.' }

    const users = getStoredUsers()
    const idx = users.findIndex(u => u.id === sessionId)
    if (idx === -1) return { success: false, error: 'User not found.' }

    if (users[idx].password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect.' }
    }

    users[idx].password = newPassword
    setStoredUsers(users)
    return { success: true }
  }, [])

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
