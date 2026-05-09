'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useSavedRecipes, SavedRecipe } from '@/context/SavedRecipesContext'
import { useCommunity } from '@/context/CommunityContext'
import categoryImages from '@/assets/categoryImages'

function SavedCard({ recipe, onRemove, onShare, shared }: { recipe: SavedRecipe; onRemove: () => void; onShare: () => void; shared: boolean }) {
  const [open, setOpen] = useState(false)
  const cardBorder = open ? 'border-2 border-main' : 'border border-gray-200'
  const btnClasses = open
    ? 'bg-white text-main border-main'
    : 'bg-main text-white border-white'

  return (
    <div className={`flex gap-4 p-4 bg-white shadow-md ${cardBorder}`}>
      <Image
        className='w-[200px] h-[200px] aspect-square object-cover'
        src={categoryImages[recipe.category]}
        alt={recipe.name}
        width={300}
        height={300}
      />
      <div className='flex flex-col gap-4 w-full p-4'>
        <div className='flex justify-between items-start'>
          <h2 className='text-3xl font-semibold'>{recipe.name}</h2>
          <span className='text-sm text-gray-400 whitespace-nowrap'>
            {new Date(recipe.savedAt).toLocaleDateString()}
          </span>
        </div>
        <p className='text-xl font-semibold'>Preparation time: {recipe.prepTime}</p>
        <p className='text-xl font-semibold'>
          Ingredients: {recipe.ingredients.map(el => ` ${el}`).join(',')}
        </p>
        {open && (
          <p className='max-w-3xl font-semibold text-lg whitespace-pre-line'>
            {recipe.prepDetails}
          </p>
        )}
        <div className='flex gap-3 self-end'>
          <button
            onClick={onRemove}
            className='border-2 px-8 py-2 rounded font-semibold text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-colors'
          >
            Remove
          </button>
          <button
            onClick={onShare}
            disabled={shared}
            className={`border-2 px-8 py-2 rounded font-semibold transition-colors ${
              shared
                ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-default'
                : 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white'
            }`}
          >
            {shared ? 'Shared ✓' : 'Share'}
          </button>
          <button
            onClick={() => setOpen(o => !o)}
            className={`${btnClasses} border-2 px-8 py-2 rounded font-semibold`}
          >
            {open ? 'Close' : 'Preparation'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SavedPage() {
  const { user, loading } = useAuth()
  const { recipes, removeRecipe } = useSavedRecipes()
  const { recipes: communityRecipes, postRecipe } = useCommunity()

  function handleShare(recipe: SavedRecipe) {
    if (!user) return
    postRecipe({
      name: recipe.name,
      prepTime: recipe.prepTime,
      ingredients: recipe.ingredients,
      prepDetails: recipe.prepDetails,
      category: recipe.category,
      authorId: user.id,
      authorName: `${user.firstName} ${user.lastName}`,
    })
  }

  function isShared(recipe: SavedRecipe) {
    if (!user) return false
    return communityRecipes.some(
      r => r.name === recipe.name && r.category === recipe.category && r.authorId === user.id
    )
  }

  if (loading) return null

  return (
    <main className='bg-gray-200 text-black min-h-[calc(100vh-92.24px-148.94px)]'>
      <section className='bg-main text-white py-12'>
        <div className='container mx-auto px-6 text-center'>
          <h1 className='text-4xl font-semibold mb-2'>My Recipes</h1>
          <p className='text-xl max-w-2xl mx-auto'>
            Your personal collection of saved recipes, all in one place.
          </p>
        </div>
      </section>

      <div className='container mx-auto p-4 py-12'>
        {!user ? (
          <div className='flex flex-col items-center gap-6 py-16'>
            <span className='text-6xl'>&#128274;</span>
            <h2 className='text-2xl font-semibold text-gray-700'>Sign in to save recipes</h2>
            <p className='text-lg text-gray-500 text-center max-w-md'>
              Create an account or log in to save your favorite recipes and access them anytime from any device.
            </p>
            <div className='flex gap-4'>
              <Link
                href='/login'
                className='bg-main text-white font-semibold py-3 px-10 rounded border-2 border-main hover:bg-white hover:text-main transition-colors'
              >
                Log In
              </Link>
              <Link
                href='/signup'
                className='bg-white text-main font-semibold py-3 px-10 rounded border-2 border-main hover:bg-main hover:text-white transition-colors'
              >
                Sign Up
              </Link>
            </div>
          </div>
        ) : recipes.length === 0 ? (
          <div className='flex flex-col items-center gap-6 py-16'>
            <span className='text-6xl'>&#128203;</span>
            <h2 className='text-2xl font-semibold text-gray-700'>No saved recipes yet</h2>
            <p className='text-lg text-gray-500 text-center max-w-md'>
              Generate recipes from the home page and save the ones you like. They&apos;ll appear here.
            </p>
            <Link
              href='/'
              className='bg-main text-white font-semibold py-3 px-10 rounded border-2 border-main hover:bg-white hover:text-main transition-colors'
            >
              Discover Recipes
            </Link>
          </div>
        ) : (
          <>
            <p className='text-gray-500 mb-6'>{recipes.length} saved recipe{recipes.length !== 1 && 's'}</p>
            <div className='flex flex-col gap-8'>
              {recipes.map(recipe => (
                <SavedCard
                  key={recipe.id}
                  recipe={recipe}
                  onRemove={() => removeRecipe(recipe.id)}
                  onShare={() => handleShare(recipe)}
                  shared={isShared(recipe)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
