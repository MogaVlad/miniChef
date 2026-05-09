'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const passwordRules = [
  { label: 'At least 6 characters', test: (p: string) => p.length >= 6 },
  { label: 'An uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'A lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'A number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'A special character (!@#$%...)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function SignUpPage() {
  const { register, user } = useAuth()
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    router.replace('/profile')
    return null
  }

  const allRulesPass = passwordRules.every(r => r.test(password))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (!allRulesPass) {
      setError('Password does not meet all requirements.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    const result = register(email.trim(), password, firstName.trim(), lastName.trim())
    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Registration failed.')
    }
  }

  return (
    <main className='bg-gray-200 text-black min-h-[calc(100vh-92.24px-148.94px)] flex items-center justify-center py-12'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-4'>
        <h1 className='text-3xl font-bold text-center mb-2'>Create Account</h1>
        <p className='text-gray-500 text-center mb-8'>Join miniChef and save your favorite recipes</p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex gap-4'>
            <div className='flex flex-col gap-1 flex-1 min-w-0'>
              <label htmlFor='firstName' className='font-semibold text-sm'>First Name</label>
              <input
                id='firstName'
                type='text'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder='John'
                className='w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-main transition-colors'
              />
            </div>
            <div className='flex flex-col gap-1 flex-1 min-w-0'>
              <label htmlFor='lastName' className='font-semibold text-sm'>Last Name</label>
              <input
                id='lastName'
                type='text'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder='Doe'
                className='w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-main transition-colors'
              />
            </div>
          </div>

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
              placeholder='Create a strong password'
              className='border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-main transition-colors'
            />
            {password.length > 0 && (
              <ul className='mt-2 flex flex-col gap-1'>
                {passwordRules.map(rule => {
                  const passes = rule.test(password)
                  return (
                    <li key={rule.label} className={`text-xs flex items-center gap-2 ${passes ? 'text-green-600' : 'text-gray-400'}`}>
                      <span>{passes ? '✓' : '•'}</span>
                      {rule.label}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='confirmPassword' className='font-semibold text-sm'>Confirm Password</label>
            <input
              id='confirmPassword'
              type='password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder='Re-enter your password'
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
            Create Account
          </button>
        </form>

        <p className='text-center text-gray-500 mt-6'>
          Already have an account?{' '}
          <Link href='/login' className='text-main font-semibold hover:underline'>
            Log In
          </Link>
        </p>
      </div>
    </main>
  )
}
