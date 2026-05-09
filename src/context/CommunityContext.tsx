'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface CommunityRecipe {
  id: string
  name: string
  prepTime: string
  ingredients: string[]
  prepDetails: string
  category: string
  authorId: string
  authorName: string
  postedAt: string
  likes: string[]
}

interface CommunityValue {
  recipes: CommunityRecipe[]
  postRecipe: (recipe: Omit<CommunityRecipe, 'id' | 'postedAt' | 'likes'>) => void
  deleteRecipe: (id: string, userId: string) => void
  toggleLike: (recipeId: string, userId: string) => void
  getByCategory: (category: string) => CommunityRecipe[]
}

const STORAGE_KEY = 'minichef_community_recipes'

const CommunityContext = createContext<CommunityValue | null>(null)

function loadRecipes(): CommunityRecipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persistRecipes(recipes: CommunityRecipe[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
}

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<CommunityRecipe[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setRecipes(loadRecipes())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) persistRecipes(recipes)
  }, [recipes, loaded])

  const postRecipe = useCallback((recipe: Omit<CommunityRecipe, 'id' | 'postedAt' | 'likes'>) => {
    setRecipes(prev => [
      {
        ...recipe,
        id: crypto.randomUUID(),
        postedAt: new Date().toISOString(),
        likes: [],
      },
      ...prev,
    ])
  }, [])

  const deleteRecipe = useCallback((id: string, userId: string) => {
    setRecipes(prev => prev.filter(r => !(r.id === id && r.authorId === userId)))
  }, [])

  const toggleLike = useCallback((recipeId: string, userId: string) => {
    setRecipes(prev => prev.map(r => {
      if (r.id !== recipeId) return r
      const liked = r.likes.includes(userId)
      return { ...r, likes: liked ? r.likes.filter(id => id !== userId) : [...r.likes, userId] }
    }))
  }, [])

  const getByCategory = useCallback((category: string) => {
    return recipes.filter(r => r.category.toLowerCase() === category.toLowerCase())
  }, [recipes])

  return (
    <CommunityContext.Provider value={{ recipes, postRecipe, deleteRecipe, toggleLike, getByCategory }}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const ctx = useContext(CommunityContext)
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider')
  return ctx
}
