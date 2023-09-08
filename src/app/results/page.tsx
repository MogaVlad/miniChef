'use client'
 
import ResultElement from '@/components/ResultElement'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function ResulsPage() {

    const [data, setData] = useState({data: []});
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState('')
    const [finalContent, setFinalContent] = useState([])

    const searchParams = useSearchParams()
    const category = searchParams?.get('selectedCategory')
    const ingredients = searchParams?.get('ingredients')

async function fetchData(){
    setIsLoading(true);
      try{
          const response = await fetch(`/api/openai?ingredients=${ingredients}?selectedCategory=${category}`, {
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

      let arr = JSON.parse(data.text);

      for(let i = 0; i< arr.length; i++){
        content.push(<ResultElement key={i} title={arr[i].name} prepTime={arr[i].duration} ingredients={arr[i].ingredients} prepDetails={arr[i].preparation} category={category}/>)
      }
      setFinalContent(content)
    }
    console.log(data.text)

  },[data])

return (
  <main className='pt-[92.25px] bg-gray-200'>
    <div className='container mx-auto flex flex-col items-center p-4 py-12 min-h-[calc(100vh-92.24px-148.94px)]'>
      <h1 className='w-full text-center pb-8 text-4xl font-semibold'>Found recipes in {category}</h1>
      {isLoading && <img className='w-40 h-40 self-center' src={"https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"} alt='loading gif' width={300} height={300}/>}
      {!isLoading && <div className='flex flex-col gap-8 w-full'>{finalContent}</div>}
    </div>
  </main>
)
}