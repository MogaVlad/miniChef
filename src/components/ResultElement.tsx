'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSavedRecipes } from '@/context/SavedRecipesContext'
import categoryImages from '@/assets/categoryImages'

export default function ResultElement({title, prepTime, ingredients, prepDetails, category}:any) {

    const { user } = useAuth()
    const { saveRecipe, isRecipeSaved } = useSavedRecipes()
    const saved = isRecipeSaved(title, category)

    const [openDivClasses, setOpenDivClasses] = useState({
        pClass: 'hidden',
        divClass: '',
        buttonContent: 'Preparation',
        buttonClasses: 'bg-main text-white border-white'
    })

    function togglePrep(){
        if(openDivClasses.pClass == 'hidden'){
            setOpenDivClasses({pClass: 'block', divClass: "border-2 border-main", buttonContent: 'Close', buttonClasses: 'bg-white text-main border-main'})
        }else{
            setOpenDivClasses({pClass: 'hidden', divClass: '', buttonContent: 'Preparation', buttonClasses: 'bg-main text-white border-white'})
        }
    }

    function handleClick(){
        togglePrep();
    }

    function handleSave(){
        if (!user || saved) return
        saveRecipe({
            name: title,
            prepTime,
            ingredients: Array.isArray(ingredients) ? ingredients : [],
            prepDetails,
            category,
            isGenerated: true,
        })
    }

  return (
    <div className={`flex flex-col sm:flex-row gap-4 p-4 bg-white shadow-md ${openDivClasses.divClass}`}>
        <Image className='w-full h-[200px] sm:w-[200px] sm:h-[200px] aspect-auto sm:aspect-square object-cover' src={categoryImages[category]} alt='img recipe' width={300} height={300}/>
        <div className='flex flex-col gap-3 sm:gap-4 w-full p-2 sm:p-4'>
            <h2 className='text-2xl sm:text-3xl font-semibold'>{title}</h2>
            <p className='text-base sm:text-xl font-semibold'>Preparation time: {prepTime}</p>
            <p className='text-base sm:text-xl font-semibold'>Ingredients: {`${ ingredients.map((el:any)=>{
                return ` ${el}`
            })}`}</p>
            <p className={`${openDivClasses.pClass} max-w-3xl font-semibold text-base sm:text-lg whitespace-pre-line`}>{prepDetails}</p>
            <div className='flex flex-wrap gap-3 self-end items-center'>
                {!user ? (
                    <Link
                        href='/login'
                        className='border-2 px-4 sm:px-8 py-2 rounded font-semibold text-sm sm:text-base text-main border-main hover:bg-main hover:text-white transition-colors'
                    >
                        Log in to Save
                    </Link>
                ) : (
                    <button
                        onClick={handleSave}
                        disabled={saved}
                        className={`border-2 px-4 sm:px-8 py-2 rounded font-semibold text-sm sm:text-base transition-colors ${
                            saved
                                ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-default'
                                : 'bg-white text-main border-main hover:bg-main hover:text-white'
                        }`}
                    >
                        {saved ? 'Saved ✓' : 'Save Recipe'}
                    </button>
                )}
                <button onClick={handleClick} className={`${openDivClasses.buttonClasses} border-2 px-4 sm:px-8 py-2 rounded font-semibold text-sm sm:text-base`}>{openDivClasses.buttonContent}</button>
            </div>
        </div>
    </div>
  )
}
