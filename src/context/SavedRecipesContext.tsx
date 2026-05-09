'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

export interface SavedRecipe {
  id: string
  name: string
  prepTime: string
  ingredients: string[]
  prepDetails: string
  category: string
  savedAt: string
}

interface SavedRecipesValue {
  recipes: SavedRecipe[]
  saveRecipe: (recipe: Omit<SavedRecipe, 'id' | 'savedAt'>) => void
  removeRecipe: (id: string) => void
  isRecipeSaved: (name: string, category: string) => boolean
}

function storageKey(userId: string) {
  return `minichef_saved_recipes_${userId}`
}

const SavedRecipesContext = createContext<SavedRecipesValue | null>(null)

export function SavedRecipesProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [recipes, setRecipes] = useState<SavedRecipe[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setRecipes([])
      setLoaded(true)
      return
    }
    try {
      const stored = localStorage.getItem(storageKey(user.id))
      setRecipes(stored ? JSON.parse(stored) : [])
    } catch {
      setRecipes([])
    }
    setLoaded(true)
  }, [user, authLoading])

  useEffect(() => {
    if (loaded && user) {
      localStorage.setItem(storageKey(user.id), JSON.stringify(recipes))
    }
  }, [recipes, loaded, user])

  const saveRecipe = useCallback((recipe: Omit<SavedRecipe, 'id' | 'savedAt'>) => {
    setRecipes(prev => {
      const exists = prev.some(r => r.name === recipe.name && r.category === recipe.category)
      if (exists) return prev
      return [...prev, {
        ...recipe,
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
      }]
    })
  }, [])

  const removeRecipe = useCallback((id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id))
  }, [])

  const isRecipeSaved = useCallback((name: string, category: string) => {
    return recipes.some(r => r.name === name && r.category === category)
  }, [recipes])

  return (
    <SavedRecipesContext.Provider value={{ recipes, saveRecipe, removeRecipe, isRecipeSaved }}>
      {children}
    </SavedRecipesContext.Provider>
  )
}

export function useSavedRecipes() {
  const ctx = useContext(SavedRecipesContext)
  if (!ctx) throw new Error('useSavedRecipes must be used within SavedRecipesProvider')
  return ctx
}
