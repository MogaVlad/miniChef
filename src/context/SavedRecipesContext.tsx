'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { getSupabase } from '@/lib/supabase'

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

export function SavedRecipesProvider({ children }: { children: React.ReactNode }) {
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

export function useSavedRecipes() {
  const ctx = useContext(SavedRecipesContext)
  if (!ctx) throw new Error('useSavedRecipes must be used within SavedRecipesProvider')
  return ctx
}
