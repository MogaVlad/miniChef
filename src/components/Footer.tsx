import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className='w-full bg-white'>
        <section className='container mx-auto p-4'>
            <section className='flex justify-between items-center'>
                <Image src={logo} alt='logo image'></Image>
                <section className='flex justify-between items-center gap-4 mr-32'>
                    <Link href='#'>About Us</Link>
                    <Link href='../app/contact'>Contact</Link>
                    <Link href='#'>FAQ</Link>
                    <Link href='#'>Legal disclosure</Link>
                    <Link href='#'>Privacy policy</Link>
                </section>
            </section> 
            <p className='text-center'> Copyright © 2023 youChef. All rights reserved</p>      
        </section>
    </footer>
  )
}
