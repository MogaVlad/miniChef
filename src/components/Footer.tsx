import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className='w-full bg-white'>
        <section className='container mx-auto p-4 px-6'>
            <section className='flex justify-between items-center'>
                <Image src={logo} alt='logo image' className='w-32 h-auto'></Image>
                <section className='flex justify-between items-center gap-6'>
                    <Link href='#'         className='hover:text-main'>About Us</Link>
                    <Link href='/contact'  className='hover:text-main'>Contact</Link>
                    <Link href='#'         className='hover:text-main'>FAQ</Link>
                    <Link href='#'         className='hover:text-main'>Legal disclosure</Link>
                    <Link href='#'         className='hover:text-main'>Privacy policy</Link>
                </section>
            </section> 
            <p className='text-center'> Copyright © youChef. All rights reserved</p>      
        </section>
    </footer>
  )
}
