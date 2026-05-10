'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

export interface SavedRecipe {
  id: string
  name: string
  prepTime: string
  ingredients: string[]
  prepDetails: string
  category: string
  savedAt: string
  isGenerated?: boolean
}

interface SavedRecipesValue {
  recipes: SavedRecipe[]
  saveRecipe: (recipe: Omit<SavedRecipe, 'id' | 'savedAt'>) => void
  removeRecipe: (id: string) => void
  isRecipeSaved: (name: string, category: string) => boolean
}

const SavedRecipesContext = createContext<SavedRecipesValue | null>(null)

const LOCAL_SAVED_KEY = 'saved_recipes'

function getLocalRecipes(userId: string): SavedRecipe[] {
  try {
    const all = JSON.parse(localStorage.getItem(LOCAL_SAVED_KEY) || '{}')
    return all[userId] || []
  } catch { return [] }
}

function setLocalRecipes(userId: string, recipes: SavedRecipe[]) {
  try {
    const all = JSON.parse(localStorage.getItem(LOCAL_SAVED_KEY) || '{}')
    all[userId] = recipes
    localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(all))
  } catch {}
}

function LocalSavedRecipesProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [recipes, setRecipes] = useState<SavedRecipe[]>([])

  useEffect(() => {
    if (authLoading) return
    if (!user) { setRecipes([]); return }
    setRecipes(getLocalRecipes(user.id))
  }, [user, authLoading])

  const saveRecipe = useCallback((recipe: Omit<SavedRecipe, 'id' | 'savedAt'>) => {
    if (!user) return
    const newRecipe: SavedRecipe = {
      ...recipe,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
    }
    setRecipes(prev => {
      const updated = [newRecipe, ...prev]
      setLocalRecipes(user.id, updated)
      return updated
    })
  }, [user])

  const removeRecipe = useCallback((id: string) => {
    if (!user) return
    setRecipes(prev => {
      const updated = prev.filter(r => r.id !== id)
      setLocalRecipes(user.id, updated)
      return updated
    })
  }, [user])

  const isRecipeSaved = useCallback((name: string, category: string) => {
    return recipes.some(r => r.name === name && r.category === category)
  }, [recipes])

  return (
    <SavedRecipesContext.Provider value={{ recipes, saveRecipe, removeRecipe, isRecipeSaved }}>
      {children}
    </SavedRecipesContext.Provider>
  )
}

function SupabaseSavedRecipesProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [recipes, setRecipes] = useState<SavedRecipe[]>([])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setRecipes([])
      return
    }

    getSupabase()
      .from('saved_recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setRecipes(data.map(r => ({
            id: r.id,
            name: r.name,
            prepTime: r.prep_time,
            ingredients: r.ingredients,
            prepDetails: r.prep_details,
            category: r.category,
            savedAt: r.saved_at,
            isGenerated: r.is_generated ?? false,
          })))
        }
      })
  }, [user, authLoading])

  const saveRecipe = useCallback(async (recipe: Omit<SavedRecipe, 'id' | 'savedAt'>) => {
    if (!user) return

    const { data, error } = await getSupabase()
      .from('saved_recipes')
      .insert({
        user_id: user.id,
        name: recipe.name,
        prep_time: recipe.prepTime,
        ingredients: recipe.ingredients,
        prep_details: recipe.prepDetails,
        category: recipe.category,
        is_generated: recipe.isGenerated ?? false,
      })
      .select()
      .single()

    if (!error && data) {
      setRecipes(prev => [{
        id: data.id,
        name: data.name,
        prepTime: data.prep_time,
        ingredients: data.ingredients,
        prepDetails: data.prep_details,
        category: data.category,
        savedAt: data.saved_at,
        isGenerated: data.is_generated ?? false,
      }, ...prev])
    }
  }, [user])

  const removeRecipe = useCallback(async (id: string) => {
    await getSupabase().from('saved_recipes').delete().eq('id', id)
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

export function SavedRecipesProvider({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    return <SupabaseSavedRecipesProvider>{children}</SupabaseSavedRecipesProvider>
  }
  return <LocalSavedRecipesProvider>{children}</LocalSavedRecipesProvider>
}

export function useSavedRecipes() {
  const ctx = useContext(SavedRecipesContext)
  if (!ctx) throw new Error('useSavedRecipes must be used within SavedRecipesProvider')
  return ctx
}
