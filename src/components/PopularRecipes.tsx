'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useSavedRecipes } from '@/context/SavedRecipesContext'
import { useCommunity, CommunityRecipe } from '@/context/CommunityContext'
import categoryImages from '@/assets/categoryImages'

export default function PopularRecipes() {
  const { user } = useAuth()
  const { saveRecipe, isRecipeSaved } = useSavedRecipes()
  const { getTopRecipes } = useCommunity()
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)

  const topRecipes = getTopRecipes(4)
  if (topRecipes.length === 0) return null

  const r: CommunityRecipe = topRecipes[active] ?? topRecipes[0]
  const saved = isRecipeSaved(r.name, r.category)
  const imgSrc = r.photoUrl || categoryImages[r.category]

  function handleSave() {
    if (!user || saved) return
    saveRecipe({
      name: r.name,
      prepTime: r.prepTime,
      ingredients: r.ingredients,
      prepDetails: r.prepDetails,
      category: r.category,
    })
  }

  const goto = (i: number) => {
    setActive(i)
    setOpen(false)
  }
  const prev = () => goto((active - 1 + topRecipes.length) % topRecipes.length)
  const next = () => goto((active + 1) % topRecipes.length)

  const cardBorder = open ? 'border-2 border-main' : 'border border-gray-200'
  const btnClasses = open
    ? 'bg-white text-main border-main'
    : 'bg-main text-white border-white'

  return (
    <section className='bg-white w-full flex items-center justify-center min-h-[500px]'>
      <div className='container mx-auto px-6 py-10'>
        <h2 className='text-center text-2xl mb-8 font-semibold'>Popular recipes</h2>

        <div className='flex items-center gap-4'>
          <button
            onClick={prev}
            aria-label='previous'
            className='w-12 h-12 rounded-full border border-gray-300 hover:border-main hover:text-main flex items-center justify-center text-2xl shrink-0'
          >
            &lsaquo;
          </button>

          <div className={`flex-1 flex gap-6 p-5 bg-white shadow-md rounded mx-auto max-w-[900px] transition-colors ${cardBorder}`}>
            {imgSrc && (
              r.photoUrl ? (
                <img
                  src={r.photoUrl}
                  alt={r.name}
                  className='w-[260px] h-[260px] object-cover rounded shrink-0'
                />
              ) : (
                <Image
                  src={imgSrc}
                  alt={r.name}
                  width={300}
                  height={300}
                  className='w-[260px] h-[260px] object-cover rounded shrink-0'
                />
              )
            )}
            <div className='flex flex-col gap-3 flex-1 p-2'>
              <h3 className='text-3xl font-semibold'>{r.name}</h3>
              <p className='text-sm text-gray-500'>
                by <span className='font-semibold text-gray-700'>{r.authorName}</span>
              </p>
              <p className='text-lg'>
                <span className='font-semibold'>Preparation time:</span> {r.prepTime}
              </p>
              <p className='text-lg'>
                <span className='font-semibold'>Ingredients:</span> {r.ingredients.join(', ')}
              </p>
              {open ? (
                <p className='max-w-3xl font-semibold text-base whitespace-pre-line'>
                  {r.prepDetails}
                </p>
              ) : (
                <p className='text-base text-gray-600'>{r.ingredients.slice(0, 3).join(', ')}...</p>
              )}
              <div className='flex gap-3 self-end items-center'>
                {!user ? (
                  <Link
                    href='/login'
                    className='border-2 px-8 py-2 rounded font-semibold text-main border-main hover:bg-main hover:text-white transition-colors'
                  >
                    Log in to Save
                  </Link>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`border-2 px-8 py-2 rounded font-semibold transition-colors ${
                      saved
                        ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-default'
                        : 'bg-white text-main border-main hover:bg-main hover:text-white'
                    }`}
                  >
                    {saved ? 'Saved ✓' : 'Save Recipe'}
                  </button>
                )}
                <button
                  onClick={() => setOpen((o) => !o)}
                  className={`border-2 px-8 py-2 rounded font-semibold transition-colors ${btnClasses}`}
                >
                  {open ? 'Close' : 'Preparation'}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={next}
            aria-label='next'
            className='w-12 h-12 rounded-full border border-gray-300 hover:border-main hover:text-main flex items-center justify-center text-2xl shrink-0'
          >
            &rsaquo;
          </button>
        </div>

        <div className='flex justify-center gap-2 mt-6'>
          {topRecipes.map((_, i) => (
            <button
              key={i}
              onClick={() => goto(i)}
              aria-label={`go to ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full ${i === active ? 'bg-main' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
