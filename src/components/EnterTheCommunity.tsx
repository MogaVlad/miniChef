'use client'

import React from 'react'
import Link from 'next/link'
import CommunityElement from '../components/CommunityElement'
import { useCommunity } from '@/context/CommunityContext'

import community_1 from '../assets/community/community_1.png'
import community_2 from '../assets/community/community_2.png'
import community_3 from '../assets/community/community_3.png'

export default function EnterTheCommunity() {
  const { recipes } = useCommunity()

  return (
    <section className='items-center flex flex-col bg-gray-300 justify-center w-full py-12'>
      <section className='container mx-auto p-4 items-center justify-center'>
        <h2 className='text-center text-2xl mb-6 font-semibold'>Enter the community</h2>
        <div className='flex flex-col md:flex-row gap-8 md:gap-10 justify-center items-center mt-[30px]'>
          <CommunityElement src={community_1} title="Find recipes" text="Explore the recipes selected by our staff uploaded by our community" />
          <CommunityElement src={community_2} title="Review recipes" text="Evaluate and comment on the dishes proposed by others" />
          <CommunityElement src={community_3} title="Add recipes" text="Pass on your know-how by proposing your recipes" />
        </div>
        <div className='text-center mt-10'>
          <p className='text-gray-600 mb-4'>
            {recipes.length > 0
              ? `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} shared by the community`
              : 'Be the first to share a recipe!'
            }
          </p>
          <Link
            href='/community'
            className='bg-main text-white font-semibold py-3 px-10 rounded border-2 border-main hover:bg-white hover:text-main transition-colors inline-block'
          >
            Join the Community
          </Link>
        </div>
      </section>
    </section>
  )
}
