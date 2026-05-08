'use client'

import ResultElement from '@/components/ResultElement'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function ResulsPage() {

    const [data, setData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState('')
    const [finalContent, setFinalContent] = useState<any[]>([])

    const searchParams = useSearchParams()
    const category = searchParams?.get('selectedCategory')
    const ingredients = searchParams?.get('ingredients')

async function fetchData(){
    setIsLoading(true);
      try{
          const response = await fetch(`/api/generate-recipes?ingredients=${ingredients}&selectedCategory=${category}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          if(!response.ok){
              throw new Error(`Error! ${response.status}`)
          }
          const result = await response.json();
          setData(result);
      } catch (err:any){
          setErr(err.message);
      } finally{
          setIsLoading(false);
      }
  }

  useEffect(()=> {
      fetchData();
  }, [])

  useEffect(()=> {

    var content:any = []

    if(data.text && typeof(data.text) != 'undefined'){
      try {
        let parsed = JSON.parse(data.text);

        if(parsed.error){
          setErr(parsed.error);
          return;
        }

        let arr = Array.isArray(parsed) ? parsed : [];
        for(let i = 0; i< arr.length; i++){
          content.push(<ResultElement key={i} title={arr[i].name} prepTime={arr[i].duration} ingredients={arr[i].ingredients} prepDetails={arr[i].preparation} category={category}/>)
        }
        setFinalContent(content)
      } catch (e: any) {
        setErr('Failed to parse recipes: ' + e.message)
      }
    }

  },[data])

  const displayCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : ''

return (
  <main className='bg-gray-200 text-black'>
    <div className='container mx-auto flex flex-col items-center p-4 py-12 min-h-[calc(100vh-92.24px-148.94px)]'>
      <div className='w-full mb-10'>
        <div className='bg-main rounded-lg py-8 px-6 text-center shadow-md'>
          <h1 className='text-4xl font-semibold text-white'>
            {displayCategory} Recipes For You
          </h1>
          {ingredients && (
            <p className='text-white/80 mt-2 text-lg'>
              Based on: {ingredients}
            </p>
          )}
        </div>
      </div>
      {isLoading && <img className='w-40 h-40 self-center' src={"https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"} alt='loading gif' width={300} height={300}/>}
      {err && <div className='flex gap-4 p-6 bg-white shadow-md w-full'>
        <div className='flex flex-col gap-3 w-full items-center text-center py-4'>
          <span className='text-5xl'>&#9888;</span>
          <h2 className='text-2xl font-semibold text-gray-800'>Oops! Something went wrong</h2>
          <p className='text-lg text-gray-600 max-w-xl'>{err}</p>
          <p className='text-md text-gray-400'>Try adjusting your ingredients or picking a different category.</p>
        </div>
      </div>}
      {!isLoading && !err && <div className='flex flex-col gap-8 w-full'>{finalContent}</div>}
    </div>
  </main>
)
}
