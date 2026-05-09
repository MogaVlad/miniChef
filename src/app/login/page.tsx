'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { login, user } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    router.replace('/profile')
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please fill in all fields.')
      return
    }

    const result = login(email.trim(), password)
    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Login failed.')
    }
  }

  return (
    <main className='bg-gray-200 text-black min-h-[calc(100vh-92.24px-148.94px)] flex items-center justify-center'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-4'>
        <h1 className='text-3xl font-bold text-center mb-2'>Welcome Back</h1>
        <p className='text-gray-500 text-center mb-8'>Log in to your miniChef account</p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email' className='font-semibold text-sm'>Email</label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='your@email.com'
              className='border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-main transition-colors'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='password' className='font-semibold text-sm'>Password</label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='Enter your password'
              className='border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-main transition-colors'
            />
          </div>

          {error && (
            <p className='text-red-500 text-sm text-center'>{error}</p>
          )}

          <button
            type='submit'
            className='bg-main text-white font-semibold py-3 rounded hover:bg-orange-600 transition-colors mt-2'
          >
            Log In
          </button>
        </form>

        <p className='text-center text-gray-500 mt-6'>
          Don&apos;t have an account?{' '}
          <Link href='/signup' className='text-main font-semibold hover:underline'>
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  )
}
