import React from 'react'
import Image from 'next/image'

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
  { src: category_breakfast, name: 'Breakfast' },
  { src: category_soups, name: 'Soups' },
  { src: category_salads, name: 'Salads' },
  { src: category_dinner, name: 'Dinner' },
  { src: category_desserts, name: 'Desserts' },
  { src: category_quick, name: 'Quick Meals' },
  { src: category_lunchbox, name: 'Lunchbox' },
  { src: category_vegetarian, name: 'Vegetarian' },
]

export default function CommunityPage() {
  return (
    <main className='min-h-screen'>
      <section className='bg-main text-white py-20'>
        <div className='container mx-auto px-6 text-center'>
          <h1 className='text-5xl font-semibold mb-4'>Enter the Community</h1>
          <p className='text-xl max-w-2xl mx-auto'>
            Discover recipes shared by fellow food lovers, contribute your own, and explore by category.
          </p>
        </div>
      </section>

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
                Evaluate and comment on the dishes proposed by others to help the community grow.
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

      <section className='bg-gray-100 py-16'>
        <div className='container mx-auto px-6'>
          <h2 className='text-3xl font-semibold mb-10 text-center'>Browse by Category</h2>
          <div className='grid grid-cols-4 gap-6 max-w-5xl mx-auto'>
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className='group cursor-pointer'>
                <div className='overflow-hidden rounded-lg shadow-md'>
                  <Image
                    src={cat.src}
                    alt={cat.name}
                    className='w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                </div>
                <h3 className='text-center font-semibold mt-3 group-hover:text-main transition-colors'>
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-white py-16'>
        <div className='container mx-auto px-6 max-w-3xl text-center'>
          <h2 className='text-3xl font-semibold mb-6'>Ready to Share Your Recipes?</h2>
          <p className='text-lg text-gray-700 mb-8'>
            Join our growing community of home cooks and food enthusiasts.
            Share your creations, get feedback, and inspire others.
          </p>
          <button className='bg-main text-white font-semibold py-3 px-10 rounded border-2 border-main hover:bg-white hover:text-main transition-colors'>
            Join the Community
          </button>
        </div>
      </section>
    </main>
  )
}
