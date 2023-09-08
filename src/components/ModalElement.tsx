'use client'

import Image from 'next/image'

export default function ModalElement({src, text, func, val, selectedVal}:any) {

  return (
    <div onClick={() => {func(val)}} className={`relative group cursor-pointer ${selectedVal == val ? "border-4 border-main" : "border-4 border-white"}`}>
        <Image className='w-[200px] transition-all duration-300 group-hover:brightness-[70%] aspect-square' src={src} alt='imagine modal' width={300} height={300}/>
        <p className='group-hover:-translate-y-2 group-hover:bg-main transition-all duration-300 absolute text-lg text-white bottom-6 py-2 rounded-md w-[80%] mx-[10%] bg-black/70 text-center'>{text}</p>
        <input className='invisible absolute' defaultChecked={val== selectedVal} type="radio" value={val} name="modal_el" />
    </div>
  )
}