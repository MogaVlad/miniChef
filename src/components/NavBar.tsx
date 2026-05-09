'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import logo from '../assets/logo.png'

export default function NavBar() {

    const pathname = usePathname()

  return (
    <nav className='bg-white w-full z-10'>
        <section className='flex justify-between mx-auto container items-center px-6'>
            <Image src={logo} alt='logo image' className='h-12 w-auto'></Image>
            <section className='justify-between flex gap-8 items-center'>
                { pathname != '/' && ( <Link href='/' className='hover:text-main'> Home </Link> )}
                <Link href='/community' className='hover:text-main'> Enter the Community </Link>
                <Link href='/saved' className='hover:text-main'> My Recipes </Link>
                <Link href='/help' className='hover:text-main'> Help & Support </Link>
            </section>
        </section>
        
    </nav>
  )
}
