'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

import logo from '../assets/logo.png'

export default function NavBar() {
    const pathname = usePathname()
    const { user } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        setDropdownOpen(false)
    }, [pathname])

    return (
        <nav className='bg-white w-full z-10'>
            <section className='flex justify-between mx-auto container items-center px-6'>
                <Image src={logo} alt='logo image' className='h-12 w-auto'/>
                <section className='justify-between flex gap-8 items-center'>
                    {pathname !== '/' && <Link href='/' className='hover:text-main'>Home</Link>}
                    <Link href='/community' className='hover:text-main'>Community</Link>
                    <Link href='/saved' className='hover:text-main'>My Recipes</Link>

                    {user ? (
                        <div className='relative' ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(prev => !prev)}
                                className='w-9 h-9 rounded-full bg-main text-white font-semibold text-sm flex items-center justify-center hover:bg-orange-600 transition-colors'
                                aria-label='Profile menu'
                            >
                                {user.firstName[0]}{user.lastName[0]}
                            </button>

                            {dropdownOpen && (
                                <div className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'>
                                    <div className='px-4 py-3 border-b border-gray-100'>
                                        <p className='font-semibold text-sm'>{user.firstName} {user.lastName}</p>
                                        <p className='text-xs text-gray-500 truncate'>{user.email}</p>
                                    </div>
                                    <Link
                                        href='/profile'
                                        className='block px-4 py-2 text-sm hover:bg-gray-50 hover:text-main transition-colors'
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        href='/saved'
                                        className='block px-4 py-2 text-sm hover:bg-gray-50 hover:text-main transition-colors'
                                    >
                                        My Recipes
                                    </Link>
                                    <div className='border-t border-gray-100 mt-1 pt-1'>
                                        <SignOutButton />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href='/login'
                            className='bg-main text-white font-semibold text-sm px-5 py-2 rounded hover:bg-orange-600 transition-colors'
                        >
                            Log In
                        </Link>
                    )}
                </section>
            </section>
        </nav>
    )
}

function SignOutButton() {
    const { logout } = useAuth()
    const router = useRouter()

    async function handleSignOut() {
        await logout()
        router.push('/')
    }

    return (
        <button
            onClick={handleSignOut}
            className='block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors'
        >
            Sign Out
        </button>
    )
}
