import React from 'react'
import Image from 'next/image'

import community_1 from '../../assets/community_1.png'
import community_2 from '../../assets/community_2.png'
import community_3 from '../../assets/community_3.png'

export default function AboutPage() {
  return (
    <main className='min-h-screen'>
      <section className='bg-main text-white py-20'>
        <div className='container mx-auto px-6 text-center'>
          <h1 className='text-5xl font-semibold mb-4'>About Us</h1>
          <p className='text-xl max-w-2xl mx-auto'>
            We believe everyone deserves a great meal — no matter what&apos;s in the fridge.
          </p>
        </div>
      </section>

      <section className='bg-white py-16'>
        <div className='container mx-auto px-6 max-w-4xl'>
          <h2 className='text-3xl font-semibold mb-6 text-center'>Our Story</h2>
          <p className='text-lg leading-relaxed text-gray-700 mb-6'>
            miniChef was born from a simple idea: cooking should be accessible,
            creative, and fun. Too often, people stare at a handful of ingredients
            and wonder what to make. We built an AI-powered recipe engine that
            turns whatever you have on hand into delicious, step-by-step meals.
          </p>
          <p className='text-lg leading-relaxed text-gray-700'>
            Whether you&apos;re a seasoned home cook or just getting started in the
            kitchen, miniChef helps you discover new flavors, reduce food waste,
            and make every meal count.
          </p>
        </div>
      </section>

      <section className='bg-gray-100 py-16'>
        <div className='container mx-auto px-6 max-w-4xl'>
          <h2 className='text-3xl font-semibold mb-6 text-center'>Our Mission</h2>
          <p className='text-lg leading-relaxed text-gray-700 text-center max-w-3xl mx-auto'>
            To empower home cooks around the world with intelligent tools that make
            meal planning effortless, reduce food waste, and bring people together
            through the joy of cooking.
          </p>
        </div>
      </section>

      <section className='bg-white py-16'>
        <div className='container mx-auto px-6'>
          <h2 className='text-3xl font-semibold mb-10 text-center'>What Makes Us Different</h2>
          <div className='flex gap-10 justify-center'>
            <div className='flex flex-col items-center gap-4 max-w-[300px]'>
              <Image src={community_1} alt='AI-powered recipes' className='w-[120px] h-[120px]' />
              <h3 className='text-main font-semibold text-lg'>AI-Powered Recipes</h3>
              <p className='text-center text-gray-600'>
                Enter any combination of ingredients and our AI generates
                complete, chef-quality recipes in seconds.
              </p>
            </div>
            <div className='flex flex-col items-center gap-4 max-w-[300px]'>
              <Image src={community_2} alt='Community driven' className='w-[120px] h-[120px]' />
              <h3 className='text-main font-semibold text-lg'>Community Driven</h3>
              <p className='text-center text-gray-600'>
                Share your own recipes, review others&apos; creations, and be part
                of a growing network of food enthusiasts.
              </p>
            </div>
            <div className='flex flex-col items-center gap-4 max-w-[300px]'>
              <Image src={community_3} alt='Curated categories' className='w-[120px] h-[120px]' />
              <h3 className='text-main font-semibold text-lg'>Curated Categories</h3>
              <p className='text-center text-gray-600'>
                Browse breakfast, soups, salads, desserts and more — each
                category hand-picked by our culinary team.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-gray-100 py-16'>
        <div className='container mx-auto px-6 max-w-4xl'>
          <h2 className='text-3xl font-semibold mb-10 text-center'>Our Team</h2>
          <div className='flex flex-col items-center text-center'>
            <div className='w-28 h-28 rounded-full bg-main mx-auto mb-4 flex items-center justify-center text-white text-4xl font-semibold'>V</div>
            <h3 className='font-semibold text-xl'>Moga Vlad-Mihai</h3>
            <p className='text-gray-500 mb-4'>Founder & Full-Stack Engineer</p>
            <p className='text-lg leading-relaxed text-gray-700 max-w-xl'>
              A food lover and engineer based in Romania, passionate about using
              technology to solve everyday problems in the kitchen.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
