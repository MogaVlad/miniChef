'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'

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
  reload: () => void
}

const CommunityContext = createContext<CommunityValue | null>(null)

function mapRow(r: any): CommunityRecipe {
  return {
    id: r.id,
    name: r.name,
    prepTime: r.prep_time,
    ingredients: r.ingredients,
    prepDetails: r.prep_details,
    category: r.category,
    authorId: r.author_id,
    authorName: r.author_name,
    postedAt: r.posted_at,
    likes: (r.community_likes ?? []).map((l: any) => l.user_id),
  }
}

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<CommunityRecipe[]>([])

  const loadRecipes = useCallback(async () => {
    const { data } = await getSupabase()
      .from('community_recipes')
      .select('*, community_likes(user_id)')
      .order('posted_at', { ascending: false })

    if (data) setRecipes(data.map(mapRow))
  }, [])

  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  const postRecipe = useCallback(async (recipe: Omit<CommunityRecipe, 'id' | 'postedAt' | 'likes'>) => {
    const { data, error } = await getSupabase()
      .from('community_recipes')
      .insert({
        author_id: recipe.authorId,
        author_name: recipe.authorName,
        name: recipe.name,
        prep_time: recipe.prepTime,
        ingredients: recipe.ingredients,
        prep_details: recipe.prepDetails,
        category: recipe.category,
      })
      .select('*, community_likes(user_id)')
      .single()

    if (!error && data) {
      setRecipes(prev => [mapRow(data), ...prev])
    }
  }, [])

  const deleteRecipe = useCallback(async (id: string, _userId: string) => {
    const { error } = await getSupabase().from('community_recipes').delete().eq('id', id)
    if (!error) setRecipes(prev => prev.filter(r => r.id !== id))
  }, [])

  const toggleLike = useCallback(async (recipeId: string, userId: string) => {
    const recipe = recipes.find(r => r.id === recipeId)
    if (!recipe) return
    const liked = recipe.likes.includes(userId)

    if (liked) {
      await getSupabase().from('community_likes').delete().eq('recipe_id', recipeId).eq('user_id', userId)
    } else {
      await getSupabase().from('community_likes').insert({ recipe_id: recipeId, user_id: userId })
    }

    setRecipes(prev => prev.map(r => {
      if (r.id !== recipeId) return r
      return {
        ...r,
        likes: liked ? r.likes.filter(id => id !== userId) : [...r.likes, userId],
      }
    }))
  }, [recipes])

  const getByCategory = useCallback((category: string) => {
    return recipes.filter(r => r.category.toLowerCase() === category.toLowerCase())
  }, [recipes])

  return (
    <CommunityContext.Provider value={{ recipes, postRecipe, deleteRecipe, toggleLike, getByCategory, reload: loadRecipes }}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const ctx = useContext(CommunityContext)
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider')
  return ctx
}
