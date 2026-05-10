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
          const result = await response.json();
          if (result.error) {
            throw new Error(result.error);
          }
          if(!response.ok){
              throw new Error("We couldn't generate recipes right now. Please try again later.")
          }
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
    <div className='container mx-auto flex flex-col items-center px-4 py-8 md:py-12 min-h-[calc(100vh-60px-100px)] md:min-h-[calc(100vh-92.24px-148.94px)]'>
      <div className='w-full mb-6 md:mb-10'>
        <div className='bg-main rounded-lg py-6 md:py-8 px-4 md:px-6 text-center shadow-md'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-semibold text-white'>
            {displayCategory} Recipes For You
          </h1>
          {ingredients && (
            <p className='text-white/80 mt-2 text-base md:text-lg'>
              Based on: {ingredients}
            </p>
          )}
        </div>
      </div>
      {isLoading && <img className='w-28 h-28 md:w-40 md:h-40 self-center' src={"https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"} alt='loading gif' width={300} height={300}/>}
      {err && <div className='flex gap-4 p-4 md:p-6 bg-white shadow-md w-full'>
        <div className='flex flex-col gap-3 w-full items-center text-center py-4'>
          <span className='text-4xl md:text-5xl'>&#9888;</span>
          <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>Oops! Something went wrong</h2>
          <p className='text-base md:text-lg text-gray-600 max-w-xl'>{err}</p>
        </div>
      </div>}
      {!isLoading && !err && <div className='flex flex-col gap-6 md:gap-8 w-full'>{finalContent}</div>}
    </div>
  </main>
)
}
