'use client'

import { useIngredientsContext } from "@/context/IngredientsContext";
import { useEffect, useState } from "react";

const PROMPTS = [
  'Try: chicken, rice, lemon',
  'Try: eggs, spinach, parmesan',
  'Try: tomatoes, basil, garlic',
];

const SUGGESTIONS = ['eggs', 'flour', 'tomatoes', 'onion', 'garlic', 'chicken'];

export default function Header() {
  const { setIngredients, setModalOpen }: any = useIngredientsContext();
  const [ing, setIng] = useState('');
  const [phIdx, setPhIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhIdx(i => (i + 1) % PROMPTS.length), 3000);
    return () => clearInterval(id);
  }, []);

  function handleChange(e: any) {
    setIng(e.target.value);
  }

  function handleClick() {
    if (!ing.trim()) {
      alert('Please enter at least one ingredient.');
      return;
    }
    setIng('');
    setModalOpen(true);
    setIngredients(ing);
  }

  function addChip(item: string) {
    const parts = ing.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.includes(item)) return;
    setIng((parts.length ? ing.replace(/,\s*$/, '') + ', ' : '') + item);
  }

  const showPlaceholder = ing.length === 0;

  return (
    <header className='relative h-[calc(100vh-92.25px)] overflow-hidden'>
      {/* Background photo */}
      <div className='absolute inset-0 bg-header bg-cover bg-center' />

      {/* Left-to-right dark gradient */}
      <div
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0) 100%)',
        }}
      />

      <section className='relative h-full px-8 md:px-16'>
        <section className='container mx-auto flex gap-6 flex-col justify-center h-full max-w-5xl'>
          <h1 className='text-5xl md:text-6xl text-white font-semibold tracking-tight'>
            A chef in every meal
          </h1>
          <p className='text-2xl text-white/90 max-w-md leading-relaxed'>
            Use AI to create recipes from your input! And then choose a category you like.
          </p>

          {/* Search card */}
          <div className='flex w-full md:w-4/5 max-w-2xl rounded-xl shadow-2xl overflow-hidden mt-2'>
            <div className='relative flex-1 bg-white'>
              <input
                onChange={handleChange}
                value={ing}
                placeholder=''
                className='outline-none px-5 py-4 w-full text-black text-base bg-transparent'
                type='text'
              />
              {showPlaceholder && (
                <div className='ph-rotator'>
                  {PROMPTS.map((p, i) => (
                    <span key={i} className={i === phIdx ? 'is-active' : ''}>
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleClick}
              className='bg-main hover:bg-[#d44e1e] transition-colors py-4 px-8 text-white font-semibold whitespace-nowrap'
            >
              Create recipes
            </button>
          </div>

          {/* Quick-add chips */}
          <div className='flex flex-wrap gap-2 mt-1'>
            <span className='text-white/80 text-sm self-center mr-1'>Quick add:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => addChip(s)}
                className='chip text-sm text-white border border-white/40 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm'
              >
                + {s}
              </button>
            ))}
          </div>
        </section>
      </section>
    </header>
  );
}