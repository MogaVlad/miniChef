'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'
import { validateRecipeContent } from '@/lib/moderation'

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
  photoUrl?: string
}

interface CommunityValue {
  recipes: CommunityRecipe[]
  postRecipe: (recipe: Omit<CommunityRecipe, 'id' | 'postedAt' | 'likes'>) => Promise<{ success: boolean; error?: string }>
  deleteRecipe: (id: string, userId: string) => void
  toggleLike: (recipeId: string, userId: string) => void
  reportRecipe: (recipeId: string) => { success: boolean; error?: string }
  getByCategory: (category: string) => CommunityRecipe[]
  getTopRecipes: (count: number) => CommunityRecipe[]
  reload: () => void
}

const CommunityContext = createContext<CommunityValue | null>(null)

const SEED_RECIPES: CommunityRecipe[] = [
  {
    id: 'seed-1',
    name: 'French croissant',
    prepTime: '5 hours 30 minutes',
    ingredients: ['500g all-purpose flour', '350g unsalted cold butter (for lamination)', '150g peach jam', '250ml whole milk', '10g dry yeast', '1 tsp salt'],
    prepDetails: "1. Combine the flour, yeast, milk, and salt; knead into a rough dough (15 min).\n2. Wrap the dough and let it rest in the refrigerator (60 min).\n3. Beat the cold butter into a flat 15cm square and enclose it within the rolled-out dough (15 min).\n4. Perform a 'turn' by rolling the dough into a rectangle and folding it in thirds; chill (45 min).\n5. Repeat the rolling and folding process two more times, chilling in between (90 min).\n6. Roll out the laminated dough to 4mm thickness, cut into triangles, and shape into croissants (20 min).\n7. Proof the croissants at room temperature until doubled in size (60 min).\n8. Bake at 200°C until golden brown and serve warm with the peach jam (25 min).",
    category: 'breakfast',
    authorId: 'admin',
    authorName: 'miniChef AI - shared by Admin',
    postedAt: '2024-01-01T00:00:00.000Z',
    likes: [],
  },
  {
    id: 'seed-2',
    name: 'Creamy tomato soup',
    prepTime: '45 minutes',
    ingredients: ['1.2kg ripe vine tomatoes', '200ml heavy cream', '1/2 cup fresh basil leaves', '1 large yellow onion', '4 cloves garlic', '2 tbsp extra virgin olive oil'],
    prepDetails: "1. Finely chop the onion and mince the garlic cloves (10 min).\n2. Heat the olive oil in a pot and sauté the onion and garlic until translucent (5 min).\n3. Roughly chop the tomatoes, add to the pot, and bring to a gentle simmer (20 min).\n4. Transfer the mixture to a high-speed blender and purée until completely smooth (5 min).\n5. Return to low heat, stir in the cream, and garnish with the torn basil leaves and cracked pepper (5 min).",
    category: 'soups',
    authorId: 'admin',
    authorName: 'miniChef AI - shared by Admin',
    postedAt: '2024-01-01T00:00:00.000Z',
    likes: [],
  },
  {
    id: 'seed-3',
    name: 'Grilled chicken & rice',
    prepTime: '1 hour',
    ingredients: ['2 large chicken breasts (approx. 500g)', '200g basmati rice', '250g fresh string peas', '4 tbsp extra virgin olive oil', '1 tsp smoked paprika'],
    prepDetails: "1. Pat the chicken dry, rub with 2 tbsp olive oil, paprika, salt, and pepper, then let marinate (15 min).\n2. Rinse the rice under cold water until clear, then bring to a boil in 400ml water and simmer until tender (20 min).\n3. Trim the string peas and steam them until tender-crisp (10 min).\n4. Preheat grill and cook chicken breasts until internal temperature reaches 165°F (10 min).\n5. Let the chicken rest for 5 minutes before slicing, then plate with the rice, peas, and a drizzle of the remaining 2 tbsp olive oil (5 min).",
    category: 'dinner',
    authorId: 'admin',
    authorName: 'miniChef AI - shared by Admin',
    postedAt: '2024-01-01T00:00:00.000Z',
    likes: [],
  },
  {
    id: 'seed-4',
    name: 'Raspberry vanilla cake',
    prepTime: '1 hour 45 minutes',
    ingredients: ['250g cake flour', '4 large eggs', '200g raspberry jam', '2 tsp vanilla extract', '300ml heavy whipping cream', '150g granulated sugar'],
    prepDetails: "1. Preheat the oven to 180°C and grease two 20cm round baking pans (10 min).\n2. In a large bowl, vigorously whip the eggs and sugar until pale, tripled in volume, and fluffy (15 min).\n3. Carefully fold the sifted flour and 1 tsp vanilla extract into the egg mixture without deflating (10 min).\n4. Pour batter evenly into pans and bake until a toothpick comes out clean (30 min).\n5. Allow the cakes to cool completely on wire racks (30 min).\n6. Whip the cream with the remaining 1 tsp vanilla extract, then assemble the layers with the raspberry jam and the cream (10 min).",
    category: 'desserts',
    authorId: 'admin',
    authorName: 'miniChef AI - shared by Admin',
    postedAt: '2024-01-01T00:00:00.000Z',
    likes: [],
  },
]

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
    photoUrl: r.photo_url ?? undefined,
  }
}

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<CommunityRecipe[]>(SEED_RECIPES)

  const loadRecipes = useCallback(async () => {
    const { data } = await getSupabase()
      .from('community_recipes')
      .select('*, community_likes(user_id)')
      .order('posted_at', { ascending: false })

    if (data) {
      const dbRecipes = data.map(mapRow)
      const seedIds = new Set(SEED_RECIPES.map(s => s.name.toLowerCase()))
      const filtered = dbRecipes.filter(r => !seedIds.has(r.name.toLowerCase()) || r.authorId !== 'admin')
      setRecipes([...filtered, ...SEED_RECIPES])
    }
  }, [])

  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  const postRecipe = useCallback(async (recipe: Omit<CommunityRecipe, 'id' | 'postedAt' | 'likes'>): Promise<{ success: boolean; error?: string }> => {
    const validation = validateRecipeContent({
      name: recipe.name,
      ingredients: recipe.ingredients,
      prepDetails: recipe.prepDetails,
    })
    if (!validation.valid) return { success: false, error: validation.error }

    const isDuplicate = recipes.some(r =>
      r.name.toLowerCase() === recipe.name.toLowerCase() &&
      r.ingredients.length === recipe.ingredients.length &&
      r.ingredients.every((ing, i) => ing.toLowerCase() === recipe.ingredients[i]?.toLowerCase())
    )
    if (isDuplicate) return { success: false, error: 'This recipe already exists in the community.' }

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

    if (error) return { success: false, error: error.message }
    if (data) {
      const mapped = mapRow(data)
      if (recipe.photoUrl) mapped.photoUrl = recipe.photoUrl
      setRecipes(prev => [mapped, ...prev])
    }
    return { success: true }
  }, [recipes])

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

  const reportRecipe = useCallback((recipeId: string): { success: boolean; error?: string } => {
    const recipe = recipes.find(r => r.id === recipeId)
    if (!recipe) return { success: false, error: 'Recipe not found.' }
    if (recipe.authorId === 'admin') return { success: false, error: 'This recipe cannot be reported.' }
    return { success: true }
  }, [recipes])

  const getByCategory = useCallback((category: string) => {
    return recipes.filter(r => r.category.toLowerCase() === category.toLowerCase())
  }, [recipes])

  const getTopRecipes = useCallback((count: number) => {
    return [...recipes].sort((a, b) => b.likes.length - a.likes.length).slice(0, count)
  }, [recipes])

  return (
    <CommunityContext.Provider value={{ recipes, postRecipe, deleteRecipe, toggleLike, reportRecipe, getByCategory, getTopRecipes, reload: loadRecipes }}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const ctx = useContext(CommunityContext)
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider')
  return ctx
}
