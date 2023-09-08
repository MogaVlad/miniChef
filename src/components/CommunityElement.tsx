import React from 'react'
import Image from 'next/image'

export default function Recipe({src,title,text}:any) {
  return (
    <div className='flex flex-col items-center gap-5'>
        <Image src={src} alt="community_element" className='mb-3 w-[300px] h-[300px]'></Image>
        <h3 className='text-main'> {title} </h3>
        <p className="text-center w-[300px]"> {text} </p>
    </div>
  )
}
