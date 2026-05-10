import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import logo from '../assets/logo.png'
import facebook from '../assets/social/Facebook.png'
import instagram from '../assets/social/Instagram.png'
import x from '../assets/social/X.png'

export default function Footer() {
  return (
    <footer className='w-full bg-white'>
        <section className='container mx-auto p-4 px-6'>
            <section className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                <Link href='/'><Image src={logo} alt='logo image' className='h-12 w-auto'></Image></Link>
                <section className='flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6'>
                    <div className='flex flex-wrap justify-center gap-4 sm:gap-6'>
                        <Link href='/about'  className='hover:text-main text-sm sm:text-base'>About Us</Link>
                        <Link href='/help'   className='hover:text-main text-sm sm:text-base'>Help & Support</Link>
                        <Link href='/terms'  className='hover:text-main text-sm sm:text-base'>Terms & Privacy</Link>
                    </div>
                    <section className='flex gap-3 items-center'>
                        <Link href='https://www.facebook.com/'>
                            <Image className='w-8 h-8' src={facebook} alt='logo facebook'></Image>
                        </Link>
                        <Link href='https://www.instagram.com/'>
                            <Image className='w-8 h-8' src={instagram} alt='logo instagram'></Image>
                        </Link>
                        <Link href='https://x.com/'>
                            <Image className='w-7 h-7' src={x} alt='logo X'></Image>
                        </Link>
                    </section>
                </section>
            </section>
            <p className='text-center text-sm mt-4'> Copyright © miniChef. All rights reserved</p>
        </section>
    </footer>
  )
}
