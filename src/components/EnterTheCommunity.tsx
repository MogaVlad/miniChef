import React from 'react'
import CommunityElement from '../components/CommunityElement'

import community_1 from '../assets/community_1.png'
import community_2 from '../assets/community_2.png'
import community_3 from '../assets/community_3.png'

export default function EnterTheCommunity() {
  return (
    <section className='items-center flex flex-col bg-gray-300 justify-center w-full h-[calc(100vh-92.25px)]'>
      <section className='container mx-auto p-4 items-center justify-center'> 
        <h2 className='text-center text-2xl mb-6 font-semibold'> Enter the community </h2>
        <div className='flex gap-8 justify-center mt-[50px]'>
            <CommunityElement src = {community_1} title = "Find recipes" text = "Explore the recipes selected by our stuff uploaded by our community"/>
            <CommunityElement src = {community_2} title = "Review recipes" text = "Evaluate and comment on the dishes proposed by others"/>
            <CommunityElement src = {community_3} title = "Add recipes" text = "Pass on your know-how by proposing your recipes"/>
        </div>
      </section>  
    </section>
  )
}
