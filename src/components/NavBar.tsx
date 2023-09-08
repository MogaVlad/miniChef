'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import logo from '../assets/logo.png'
import facebook from '../assets/Facebook.png'
import instagram from '../assets/Instagram.png'
import twitter from '../assets/Twitter.png'

export default function NavBar() {

    const pathname = usePathname()

  return (
    <nav className='bg-white w-full z-10'>
        <section className='flex justify-between mx-auto container items-center'>
            <Image src={logo} alt='logo image'></Image>
            <section className='justify-between flex gap-8 items-center'>
                { pathname != '/' && ( <Link href=''> Home </Link> )}
                <Link href='' className='hover:text-main'> Enter the Comunity </Link>
                <Link href='../app/contact' className='hover:text-main'> Contact </Link>
                <section className='flex'>
                    <Link href='https://www.facebook.com/'>
                        <Image className='w-8 h-8' src={facebook} alt='logo facebook'></Image>
                    </Link>
                    <Link href='https://www.instagram.com/'>
                        <Image className='w-8 h-8' src={instagram} alt='logo instagram'></Image>
                    </Link>
                    <Link href='https://twitter.com/'>
                        <Image className='w-8 h-8' src={twitter} alt='logo twitter'></Image>
                    </Link>
                    
                </section>
            </section>
        </section>
        
    </nav>
  )
}
