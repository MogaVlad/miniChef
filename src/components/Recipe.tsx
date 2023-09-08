import React from 'react'
import Image from 'next/image'

export default function Recipe({src,text}:any) {
  return (
    <div className='flex flex-col items-center'>
        <Image src={src} alt="reteta" className='mb-3 w-[350px] h-[350px]'></Image>
        <p className='max-w-[250px] text-center'> {text} </p>
    </div>
  )
}
