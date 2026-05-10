import React from 'react'
import Image from 'next/image'

export default function Recipe({src,title,text}:any) {
  return (
    <div className='flex flex-col items-center gap-4 max-w-[300px]'>
      <Image src={src} alt="community_element" className='w-[120px] h-[120px]' />
      <h3 className='text-main font-semibold text-lg'>{title}</h3>
      <p className='text-center text-gray-600'>{text}</p>
    </div>
  )
}
