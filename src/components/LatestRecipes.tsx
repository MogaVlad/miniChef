import React from 'react'
import Recipe from './Recipe'

import latest_1 from '../assets/latest/latest_1.jpg'
import latest_2 from '../assets/latest/latest_2.jpg'
import latest_3 from '../assets/latest/latest_3.jpg'
import latest_4 from '../assets/latest/latest_4.jpg'

export default function LatestRecipes() {
  return (
    <section className='items-center bg-white flex flex-col w-full h-[calc(100vh-92.25px)] justify-center'>
        <section className='container mx-auto p-4 items-center'> 
            <h2 className='mb-6 text-center text-2xl font-semibold'> Latest recipes </h2>
            <div className='flex gap-7 justify-center mt-[50px]'>
                <Recipe src = {latest_1} text="French croissant with butter and peach jam"/>
                <Recipe src = {latest_2} text="Creamy tomato soup"/>
                <Recipe src = {latest_3} text="Grilled chicken breast with cooked rice and string peas"/>
                <Recipe src = {latest_4} text="Raspberry jam and vanilla cream cake"/>
            </div>
        </section>
        
        
    </section>
  )
}
