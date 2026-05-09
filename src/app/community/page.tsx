'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useSavedRecipes } from '@/context/SavedRecipesContext'
import { useCommunity, CommunityRecipe } from '@/context/CommunityContext'
import categoryImages from '@/assets/categoryImages'

import community_1 from '../../assets/community/community_1.png'
import community_2 from '../../assets/community/community_2.png'
import community_3 from '../../assets/community/community_3.png'

import category_breakfast from '../../assets/category_images/category_breakfast.jpg'
import category_soups from '../../assets/category_images/category_soups.jpg'
import category_salads from '../../assets/category_images/category_salads.jpg'
import category_dinner from '../../assets/category_images/category_dinner.jpg'
import category_desserts from '../../assets/category_images/category_desserts.jpg'
import category_quick from '../../assets/category_images/category_quick.jpg'
import category_lunchbox from '../../assets/category_images/category_lunchbox.jpg'
import category_vegetarian from '../../assets/category_images/category_vegetarian.jpg'

const CATEGORIES = [
  { src: category_breakfast, name: 'Breakfast', key: 'breakfast' },
  { src: category_soups, name: 'Soups', key: 'soups' },
  { src: category_salads, name: 'Salads', key: 'salads' },
  { src: category_dinner, name: 'Dinner', key: 'dinner' },
  { src: category_desserts, name: 'Desserts', key: 'desserts' },
  { src: category_quick, name: 'Quick Meals', key: 'quick' },
  { src: category_lunchbox, name: 'Lunchbox', key: 'lunchbox' },
  { src: category_vegetarian, name: 'Vegetarian', key: 'vegetarian' },
]

const CATEGORY_KEYS = CATEGORIES.map(c => c.key)

function PostRecipeForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const { recipes: savedRecipes } = useSavedRecipes()
  const { postRecipe } = useCommunity()

  const [mode, setMode] = useState<'saved' | 'new'>('new')
  const [selectedSaved, setSelectedSaved] = useState('')

  const [name, setName] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [prepDetails, setPrepDetails] = useState('')
  const [category, setCategory] = useState(CATEGORY_KEYS[0])
  const [error, setError] = useState('')

  if (!user) return null

  function handleSelectSaved(id: string) {
    setSelectedSaved(id)
    const r = savedRecipes.find(r => r.id === id)
    if (r) {
      setName(r.name)
      setPrepTime(r.prepTime)
      setIngredients(r.ingredients.join(', '))
      setPrepDetails(r.prepDetails)
      setCategory(CATEGORY_KEYS.includes(r.category) ? r.category : CATEGORY_KEYS[0])
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!user || !name.trim() || !prepTime.trim() || !ingredients.trim() || !prepDetails.trim()) {
      setError('Please fill in all fields.')
      return
    }
    postRecipe({
      name: name.trim(),
      prepTime: prepTime.trim(),
      ingredients: ingredients.split(',').map(s => s.trim()).filter(Boolean),
      prepDetails: prepDetails.trim(),
      category,
      authorId: user.id,
      authorName: `${user.firstName} ${user.lastName}`,
    })
    onClose()
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={onClose}>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6' onClick={e => e.stopPropagation()}>
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-xl font-semibold'>Share a Recipe</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 text-2xl leading-none'>&times;</button>
        </div>

        {savedRecipes.length > 0 && (
          <div className='flex gap-2 mb-5'>
            <button
              onClick={() => setMode('new')}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-colors ${mode === 'new' ? 'bg-main text-white border-main' : 'border-gray-300 text-gray-600 hover:border-main hover:text-main'}`}
            >
              Write New
            </button>
            <button
              onClick={() => setMode('saved')}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-colors ${mode === 'saved' ? 'bg-main text-white border-main' : 'border-gray-300 text-gray-600 hover:border-main hover:text-main'}`}
            >
              From Saved
            </button>
          </div>
        )}

        {mode === 'saved' && savedRecipes.length > 0 && (
          <div className='mb-4'>
            <label className='font-semibold text-xs text-gray-500 block mb-1'>Select a saved recipe</label>
            <select
              value={selectedSaved}
              onChange={e => handleSelectSaved(e.target.value)}
              className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-main'
            >
              <option value=''>Choose...</option>
              {savedRecipes.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1'>
            <label className='font-semibold text-xs text-gray-500'>Recipe Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder='e.g. Grandma&apos;s Pancakes'
              className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-main' />
          </div>
          <div className='flex gap-3'>
            <div className='flex flex-col gap-1 flex-1'>
              <label className='font-semibold text-xs text-gray-500'>Prep Time</label>
              <input value={prepTime} onChange={e => setPrepTime(e.target.value)} placeholder='e.g. 30 minutes'
                className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-main' />
            </div>
            <div className='flex flex-col gap-1 flex-1'>
              <label className='font-semibold text-xs text-gray-500'>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-main'>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <label className='font-semibold text-xs text-gray-500'>Ingredients (comma-separated)</label>
            <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} rows={2} placeholder='e.g. 2 eggs, 200g flour, 1 cup milk'
              className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-main resize-none' />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='font-semibold text-xs text-gray-500'>Preparation Steps</label>
            <textarea value={prepDetails} onChange={e => setPrepDetails(e.target.value)} rows={5} placeholder='Write each step on a new line...'
              className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-main resize-none' />
          </div>

          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <button type='submit' className='bg-main text-white font-semibold py-2.5 rounded hover:bg-orange-600 transition-colors mt-1'>
            Share with Community
          </button>
        </form>
      </div>
    </div>
  )
}

function CommunityCard({ recipe }: { recipe: CommunityRecipe }) {
  const { user } = useAuth()
  const { toggleLike, deleteRecipe } = useCommunity()
  const { saveRecipe, isRecipeSaved } = useSavedRecipes()
  const [open, setOpen] = useState(false)

  const liked = user ? recipe.likes.includes(user.id) : false
  const saved = isRecipeSaved(recipe.name, recipe.category)
  const isAuthor = user ? recipe.authorId === user.id : false
  const imgSrc = categoryImages[recipe.category]

  function handleSave() {
    if (!user || saved) return
    saveRecipe({
      name: recipe.name,
      prepTime: recipe.prepTime,
      ingredients: recipe.ingredients,
      prepDetails: recipe.prepDetails,
      category: recipe.category,
    })
  }

  const cardBorder = open ? 'border-2 border-main' : 'border border-gray-200'
  const prepBtnClasses = open ? 'bg-white text-main border-main' : 'bg-main text-white border-white'

  return (
    <div className={`flex gap-4 p-4 bg-white shadow-md rounded-lg ${cardBorder}`}>
      {imgSrc && (
        <Image src={imgSrc} alt={recipe.name} width={300} height={300}
          className='w-[180px] h-[180px] object-cover rounded shrink-0' />
      )}
      <div className='flex flex-col gap-3 flex-1 min-w-0'>
        <div className='flex justify-between items-start gap-2'>
          <h3 className='text-2xl font-semibold'>{recipe.name}</h3>
          <span className='text-xs text-gray-400 whitespace-nowrap shrink-0'>
            {new Date(recipe.postedAt).toLocaleDateString()}
          </span>
        </div>
        <p className='text-sm text-gray-500'>
          by <span className='font-semibold text-gray-700'>{recipe.authorName}</span>
        </p>
        <p className='text-sm'><span className='font-semibold'>Prep time:</span> {recipe.prepTime}</p>
        <p className='text-sm'><span className='font-semibold'>Ingredients:</span> {recipe.ingredients.join(', ')}</p>
        {open && (
          <p className='text-sm whitespace-pre-line'>{recipe.prepDetails}</p>
        )}
        <div className='flex gap-3 items-center mt-auto flex-wrap'>
          <button
            onClick={() => user && toggleLike(recipe.id, user.id)}
            disabled={!user}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded border transition-colors ${
              liked
                ? 'bg-red-50 text-red-500 border-red-200'
                : user
                  ? 'border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500'
                  : 'border-gray-200 text-gray-300 cursor-default'
            }`}
          >
            {liked ? '♥' : '♡'} {recipe.likes.length}
          </button>

          {user ? (
            <button onClick={handleSave} disabled={saved}
              className={`text-sm font-semibold px-4 py-1.5 rounded border transition-colors ${
                saved
                  ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-default'
                  : 'border-main text-main hover:bg-main hover:text-white'
              }`}
            >
              {saved ? 'Saved ✓' : 'Save'}
            </button>
          ) : (
            <Link href='/login' className='text-sm font-semibold px-4 py-1.5 rounded border border-main text-main hover:bg-main hover:text-white transition-colors'>
              Log in to Save
            </Link>
          )}

          <button onClick={() => setOpen(o => !o)}
            className={`text-sm font-semibold px-4 py-1.5 rounded border-2 transition-colors ${prepBtnClasses}`}>
            {open ? 'Close' : 'Preparation'}
          </button>

          {isAuthor && (
            <button onClick={() => deleteRecipe(recipe.id, user!.id)}
              className='text-sm font-semibold px-4 py-1.5 rounded border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-auto'>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const { user } = useAuth()
  const { recipes } = useCommunity()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const filtered = activeCategory
    ? recipes.filter(r => r.category === activeCategory)
    : recipes

  return (
    <main className='min-h-screen'>
      {/* Banner */}
      <section className='bg-main text-white py-12'>
        <div className='container mx-auto px-6 text-center'>
          <h1 className='text-4xl font-semibold mb-2'>Enter the Community</h1>
          <p className='text-xl max-w-2xl mx-auto'>
            Discover recipes shared by fellow food lovers, contribute your own, and explore by category.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className='bg-white py-16'>
        <div className='container mx-auto px-6'>
          <h2 className='text-3xl font-semibold mb-10 text-center'>How It Works</h2>
          <div className='flex gap-10 justify-center'>
            <div className='flex flex-col items-center gap-4 max-w-[300px]'>
              <Image src={community_1} alt='Find recipes' className='w-[120px] h-[120px]' />
              <h3 className='text-main font-semibold text-lg'>Find Recipes</h3>
              <p className='text-center text-gray-600'>
                Explore the recipes selected by our staff and uploaded by our community members.
              </p>
            </div>
            <div className='flex flex-col items-center gap-4 max-w-[300px]'>
              <Image src={community_2} alt='Review recipes' className='w-[120px] h-[120px]' />
              <h3 className='text-main font-semibold text-lg'>Review Recipes</h3>
              <p className='text-center text-gray-600'>
                Like and save the dishes proposed by others to help the community grow.
              </p>
            </div>
            <div className='flex flex-col items-center gap-4 max-w-[300px]'>
              <Image src={community_3} alt='Add recipes' className='w-[120px] h-[120px]' />
              <h3 className='text-main font-semibold text-lg'>Add Recipes</h3>
              <p className='text-center text-gray-600'>
                Pass on your know-how by proposing your own recipes for everyone to enjoy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className='bg-gray-100 py-16'>
        <div className='container mx-auto px-6'>
          <h2 className='text-3xl font-semibold mb-10 text-center'>Browse by Category</h2>
          <div className='grid grid-cols-4 gap-6 max-w-5xl mx-auto'>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key
              return (
                <button key={cat.key} onClick={() => setActiveCategory(isActive ? null : cat.key)}
                  className='group text-left'>
                  <div className={`overflow-hidden rounded-lg shadow-md ring-2 transition-all ${isActive ? 'ring-main' : 'ring-transparent'}`}>
                    <Image src={cat.src} alt={cat.name}
                      className='w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-300' />
                  </div>
                  <h3 className={`text-center font-semibold mt-3 transition-colors ${isActive ? 'text-main' : 'group-hover:text-main'}`}>
                    {cat.name}
                  </h3>
                </button>
              )
            })}
          </div>
          {activeCategory && (
            <div className='text-center mt-6'>
              <button onClick={() => setActiveCategory(null)} className='text-sm text-gray-500 hover:text-main font-semibold'>
                Clear filter &times;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Community feed */}
      <section className='bg-gray-200 py-16'>
        <div className='container mx-auto px-6 max-w-4xl'>
          <div className='flex justify-between items-center mb-8'>
            <h2 className='text-3xl font-semibold'>
              {activeCategory
                ? `${CATEGORIES.find(c => c.key === activeCategory)?.name} Recipes`
                : 'Community Recipes'}
            </h2>
            {user ? (
              <button onClick={() => setShowForm(true)}
                className='bg-main text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-orange-600 transition-colors'>
                + Share a Recipe
              </button>
            ) : (
              <Link href='/login'
                className='bg-main text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-orange-600 transition-colors'>
                Log in to Share
              </Link>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className='text-center py-16'>
              <span className='text-6xl block mb-4'>&#127869;</span>
              <h3 className='text-2xl font-semibold text-gray-700 mb-2'>
                {activeCategory ? 'No recipes in this category yet' : 'No recipes shared yet'}
              </h3>
              <p className='text-gray-500 max-w-md mx-auto'>
                Be the first to share a recipe with the community!
              </p>
            </div>
          ) : (
            <div className='flex flex-col gap-6'>
              {filtered.map(recipe => (
                <CommunityCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>

      {showForm && <PostRecipeForm onClose={() => setShowForm(false)} />}
    </main>
  )
}
