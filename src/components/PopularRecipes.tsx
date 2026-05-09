'use client'

import React, { useState } from 'react'
import Image from 'next/image'

import popular_1 from '../assets/popular_recipes/popular_1.jpg'
import popular_2 from '../assets/popular_recipes/popular_2.jpg'
import popular_3 from '../assets/popular_recipes/popular_3.jpg'
import popular_4 from '../assets/popular_recipes/popular_4.jpg'

const RECIPES = [
  {
    src: popular_1,
    title: 'French croissant',
    text: 'Buttery croissant with peach jam',
    prepTime: '5 hours 30 minutes',
    ingredients: [
      '500g all-purpose flour', 
      '350g unsalted cold butter (for lamination)', 
      '150g peach jam', 
      '250ml whole milk', 
      '10g dry yeast', 
      '1 tsp salt'
    ],
    prepDetails:
      "1. Combine the flour, yeast, milk, and salt; knead into a rough dough (15 min).\n2. Wrap the dough and let it rest in the refrigerator (60 min).\n3. Beat the cold butter into a flat 15cm square and enclose it within the rolled-out dough (15 min).\n4. Perform a 'turn' by rolling the dough into a rectangle and folding it in thirds; chill (45 min).\n5. Repeat the rolling and folding process two more times, chilling in between (90 min).\n6. Roll out the laminated dough to 4mm thickness, cut into triangles, and shape into croissants (20 min).\n7. Proof the croissants at room temperature until doubled in size (60 min).\n8. Bake at 200°C until golden brown and serve warm with the peach jam (25 min).",
  },
  {
    src: popular_2,
    title: 'Creamy tomato soup',
    text: 'Creamy tomato soup',
    prepTime: '45 minutes',
    ingredients: [
      '1.2kg ripe vine tomatoes', 
      '200ml heavy cream', 
      '1/2 cup fresh basil leaves', 
      '1 large yellow onion', 
      '4 cloves garlic', 
      '2 tbsp extra virgin olive oil'
    ],
    prepDetails:
      "1. Finely chop the onion and mince the garlic cloves (10 min).\n2. Heat the olive oil in a pot and sauté the onion and garlic until translucent (5 min).\n3. Roughly chop the tomatoes, add to the pot, and bring to a gentle simmer (20 min).\n4. Transfer the mixture to a high-speed blender and purée until completely smooth (5 min).\n5. Return to low heat, stir in the cream, and garnish with the torn basil leaves and cracked pepper (5 min).",
  },
  {
    src: popular_3,
    title: 'Grilled chicken & rice',
    text: 'Grilled chicken breast with rice and string peas',
    prepTime: '1 hour',
    ingredients: [
      '2 large chicken breasts (approx. 500g)', 
      '200g basmati rice', 
      '250g fresh string peas', 
      '4 tbsp extra virgin olive oil', 
      '1 tsp smoked paprika'
    ],
    prepDetails:
      "1. Pat the chicken dry, rub with 2 tbsp olive oil, paprika, salt, and pepper, then let marinate (15 min).\n2. Rinse the rice under cold water until clear, then bring to a boil in 400ml water and simmer until tender (20 min).\n3. Trim the string peas and steam them until tender-crisp (10 min).\n4. Preheat grill and cook chicken breasts until internal temperature reaches 165°F (10 min).\n5. Let the chicken rest for 5 minutes before slicing, then plate with the rice, peas, and a drizzle of the remaining 2 tbsp olive oil (5 min).",
  },
  {
    src: popular_4,
    title: 'Raspberry vanilla cake',
    text: 'Raspberry jam and vanilla cream cake',
    prepTime: '1 hour 45 minutes',
    ingredients: [
      '250g cake flour', 
      '4 large eggs', 
      '200g raspberry jam', 
      '2 tsp vanilla extract', 
      '300ml heavy whipping cream', 
      '150g granulated sugar'
    ],
    prepDetails:
      "1. Preheat the oven to 180°C and grease two 20cm round baking pans (10 min).\n2. In a large bowl, vigorously whip the eggs and sugar until pale, tripled in volume, and fluffy (15 min).\n3. Carefully fold the sifted flour and 1 tsp vanilla extract into the egg mixture without deflating (10 min).\n4. Pour batter evenly into pans and bake until a toothpick comes out clean (30 min).\n5. Allow the cakes to cool completely on wire racks (30 min).\n6. Whip the cream with the remaining 1 tsp vanilla extract, then assemble the layers with the raspberry jam and the cream (10 min).",
  },
]

export default function PopularRecipes() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const r = RECIPES[active]

  const goto = (i: number) => {
    setActive(i)
    setOpen(false)
  }
  const prev = () => goto((active - 1 + RECIPES.length) % RECIPES.length)
  const next = () => goto((active + 1) % RECIPES.length)

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
            <Image
              src={r.src}
              alt={r.title}
              className='w-[260px] h-[260px] object-cover rounded shrink-0'
            />
            <div className='flex flex-col gap-3 flex-1 p-2'>
              <h3 className='text-3xl font-semibold'>{r.title}</h3>
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
                <p className='text-base text-gray-600'>{r.text}</p>
              )}
              <button
                onClick={() => setOpen((o) => !o)}
                className={`border-2 px-8 py-2 rounded self-end font-semibold transition-colors ${btnClasses}`}
              >
                {open ? 'Close' : 'Preparation'}
              </button>
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
          {RECIPES.map((_, i) => (
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