'use client'

import { useIngredientsContext } from "@/context/IngredientsContext";
import { useState } from "react";

export default function Header() {

  const { setIngredients, setModalOpen }:any = useIngredientsContext();
  const [ ing, setIng] = useState('');

  function handleChange(e:any){
    setIng(e.target.value);
  }
  function handleClick(){
    setIng('');
    setModalOpen(true);
    setIngredients(ing);
  }

  return (
    <header className='bg-header bg-cover h-[calc(100vh-92.25px)]'>
        <section className='backdrop-brightness-[65%] p-4 px-32 h-full'>
            <section className='container mx-auto flex gap-6 flex-col justify-center h-full'>
                <h1 className='text-5xl text-white font-semibold'>A chef in every meal</h1>
                <p className='text-2xl text-white max-w-md'>Use AI to create recipes from your input! And then choose a category you like.</p>
                <div className='flex w-4/5 rounded'>
                    <input onChange={handleChange} value={ing} placeholder='What ingredients do you have?' className='outline-none px-2 w-full border-2 border-main' type="text" />
                    <button onClick={handleClick} className='bg-main py-3 px-8 border border-main text-white font-semibold whitespace-nowrap'>Create recipes</button>
                </div>
            </section>
        </section>
    </header>
  )
}