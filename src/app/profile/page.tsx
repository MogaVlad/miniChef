'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useSavedRecipes } from '@/context/SavedRecipesContext'

const passwordRules = [
  { label: 'At least 6 characters', test: (p: string) => p.length >= 6 },
  { label: 'An uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'A lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'A number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'A special character (!@#$%...)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function ProfilePage() {
  const { user, loading, logout, updateProfile, changePassword } = useAuth()
  const { recipes } = useSavedRecipes()
  const router = useRouter()

  const [editingName, setEditingName] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nameMsg, setNameMsg] = useState({ text: '', ok: false })

  const [editingPassword, setEditingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwMsg, setPwMsg] = useState({ text: '', ok: false })

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
    }
  }, [user])

  if (loading) return null

  if (!user) {
    return (
      <main className='bg-gray-200 text-black min-h-[calc(100vh-92.24px-148.94px)] flex items-center justify-center'>
        <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-4 text-center'>
          <span className='text-6xl block mb-4'>&#128274;</span>
          <h1 className='text-2xl font-bold mb-2'>Not Logged In</h1>
          <p className='text-gray-500 mb-6'>Please log in to view your profile.</p>
          <Link
            href='/login'
            className='bg-main text-white font-semibold py-3 px-8 rounded hover:bg-orange-600 transition-colors inline-block'
          >
            Log In
          </Link>
        </div>
      </main>
    )
  }

  function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    setNameMsg({ text: '', ok: false })
    if (!firstName.trim() || !lastName.trim()) {
      setNameMsg({ text: 'Both fields are required.', ok: false })
      return
    }
    const result = updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() })
    if (result.success) {
      setNameMsg({ text: 'Name updated successfully.', ok: true })
      setEditingName(false)
    } else {
      setNameMsg({ text: result.error || 'Update failed.', ok: false })
    }
  }

  function handleCancelName() {
    setFirstName(user!.firstName)
    setLastName(user!.lastName)
    setEditingName(false)
    setNameMsg({ text: '', ok: false })
  }

  const allPwRulesPass = passwordRules.every(r => r.test(newPassword))

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwMsg({ text: '', ok: false })
    if (!currentPassword) {
      setPwMsg({ text: 'Please enter your current password.', ok: false })
      return
    }
    if (!allPwRulesPass) {
      setPwMsg({ text: 'New password does not meet all requirements.', ok: false })
      return
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ text: 'New passwords do not match.', ok: false })
      return
    }
    const result = changePassword(currentPassword, newPassword)
    if (result.success) {
      setPwMsg({ text: 'Password changed successfully.', ok: true })
      setEditingPassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setPwMsg({ text: result.error || 'Password change failed.', ok: false })
    }
  }

  function handleCancelPassword() {
    setEditingPassword(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPwMsg({ text: '', ok: false })
  }

  function handleLogout() {
    logout()
    router.push('/')
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className='bg-gray-200 text-black min-h-[calc(100vh-92.24px-148.94px)]'>
      {/* Compact header */}
      <section className='bg-main text-white py-6'>
        <div className='container mx-auto px-6 flex items-center gap-4'>
          <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0'>
            <span className='text-lg font-bold'>{user.firstName[0]}{user.lastName[0]}</span>
          </div>
          <div className='flex-1 min-w-0'>
            <h1 className='text-2xl font-semibold'>{user.firstName} {user.lastName}</h1>
            <p className='text-white/70 text-sm truncate'>{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className='text-sm text-white/80 hover:text-white border border-white/30 rounded-full px-4 py-1.5 hover:border-white transition-colors'
          >
            Sign Out
          </button>
        </div>
      </section>

      <div className='container mx-auto p-4 py-10 max-w-2xl flex flex-col gap-6'>
        {/* Personal info */}
        <div className='bg-white shadow-md rounded-lg p-6'>
          <div className='flex justify-between items-center mb-5'>
            <h2 className='text-xl font-semibold'>Personal Info</h2>
            {!editingName && (
              <button onClick={() => { setEditingName(true); setNameMsg({ text: '', ok: false }) }} className='text-main text-sm font-semibold hover:underline'>
                Edit
              </button>
            )}
          </div>

          {editingName ? (
            <form onSubmit={handleSaveName} className='flex flex-col gap-4'>
              <div className='flex gap-4'>
                <div className='flex flex-col gap-1 flex-1 min-w-0'>
                  <label htmlFor='firstName' className='font-semibold text-xs text-gray-500'>First Name</label>
                  <input id='firstName' type='text' value={firstName} onChange={e => setFirstName(e.target.value)}
                    className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-main transition-colors' />
                </div>
                <div className='flex flex-col gap-1 flex-1 min-w-0'>
                  <label htmlFor='lastName' className='font-semibold text-xs text-gray-500'>Last Name</label>
                  <input id='lastName' type='text' value={lastName} onChange={e => setLastName(e.target.value)}
                    className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-main transition-colors' />
                </div>
              </div>
              {nameMsg.text && <p className={`text-sm ${nameMsg.ok ? 'text-green-600' : 'text-red-500'}`}>{nameMsg.text}</p>}
              <div className='flex gap-3 justify-end'>
                <button type='button' onClick={handleCancelName} className='text-sm text-gray-500 hover:text-gray-700 font-semibold px-4 py-1.5'>Cancel</button>
                <button type='submit' className='bg-main text-white text-sm font-semibold px-5 py-1.5 rounded hover:bg-orange-600 transition-colors'>Save</button>
              </div>
            </form>
          ) : (
            <div className='flex flex-col gap-3'>
              <div className='flex justify-between py-2 border-b border-gray-100'>
                <span className='text-gray-500 text-sm'>First Name</span>
                <span className='font-semibold text-sm'>{user.firstName}</span>
              </div>
              <div className='flex justify-between py-2 border-b border-gray-100'>
                <span className='text-gray-500 text-sm'>Last Name</span>
                <span className='font-semibold text-sm'>{user.lastName}</span>
              </div>
              <div className='flex justify-between py-2 border-b border-gray-100'>
                <span className='text-gray-500 text-sm'>Email</span>
                <span className='font-semibold text-sm'>{user.email}</span>
              </div>
              <div className='flex justify-between py-2 border-b border-gray-100'>
                <span className='text-gray-500 text-sm'>Member Since</span>
                <span className='font-semibold text-sm'>{memberSince}</span>
              </div>
              <div className='flex justify-between py-2'>
                <span className='text-gray-500 text-sm'>Saved Recipes</span>
                <span className='font-semibold text-sm'>{recipes.length}</span>
              </div>
              {nameMsg.text && <p className={`text-sm ${nameMsg.ok ? 'text-green-600' : 'text-red-500'}`}>{nameMsg.text}</p>}
            </div>
          )}
        </div>

        {/* Password */}
        <div className='bg-white shadow-md rounded-lg p-6'>
          <div className='flex justify-between items-center mb-5'>
            <h2 className='text-xl font-semibold'>Password</h2>
            {!editingPassword && (
              <button onClick={() => { setEditingPassword(true); setPwMsg({ text: '', ok: false }) }} className='text-main text-sm font-semibold hover:underline'>
                Change
              </button>
            )}
          </div>

          {editingPassword ? (
            <form onSubmit={handleChangePassword} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='currentPassword' className='font-semibold text-xs text-gray-500'>Current Password</label>
                <input id='currentPassword' type='password' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                  placeholder='Enter current password'
                  className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-main transition-colors' />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor='newPassword' className='font-semibold text-xs text-gray-500'>New Password</label>
                <input id='newPassword' type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder='Enter new password'
                  className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-main transition-colors' />
                {newPassword.length > 0 && (
                  <ul className='mt-2 flex flex-col gap-1'>
                    {passwordRules.map(rule => {
                      const passes = rule.test(newPassword)
                      return (
                        <li key={rule.label} className={`text-xs flex items-center gap-2 ${passes ? 'text-green-600' : 'text-gray-400'}`}>
                          <span>{passes ? '✓' : '•'}</span>{rule.label}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor='confirmNewPassword' className='font-semibold text-xs text-gray-500'>Confirm New Password</label>
                <input id='confirmNewPassword' type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder='Re-enter new password'
                  className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-main transition-colors' />
              </div>
              {pwMsg.text && <p className={`text-sm ${pwMsg.ok ? 'text-green-600' : 'text-red-500'}`}>{pwMsg.text}</p>}
              <div className='flex gap-3 justify-end'>
                <button type='button' onClick={handleCancelPassword} className='text-sm text-gray-500 hover:text-gray-700 font-semibold px-4 py-1.5'>Cancel</button>
                <button type='submit' className='bg-main text-white text-sm font-semibold px-5 py-1.5 rounded hover:bg-orange-600 transition-colors'>Update Password</button>
              </div>
            </form>
          ) : (
            <div>
              <p className='text-sm text-gray-500'>••••••••••</p>
              {pwMsg.text && <p className={`text-sm mt-2 ${pwMsg.ok ? 'text-green-600' : 'text-red-500'}`}>{pwMsg.text}</p>}
            </div>
          )}
        </div>

        {/* Billing */}
        <div className='bg-white shadow-md rounded-lg p-6'>
          <div className='flex justify-between items-center mb-5'>
            <h2 className='text-xl font-semibold'>Billing</h2>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex justify-between py-2 border-b border-gray-100'>
              <span className='text-gray-500 text-sm'>Current Plan</span>
              <span className='font-semibold text-sm bg-green-100 text-green-700 px-3 py-0.5 rounded-full'>Free</span>
            </div>
            <div className='flex justify-between py-2 border-b border-gray-100'>
              <span className='text-gray-500 text-sm'>Recipes Generated</span>
              <span className='font-semibold text-sm'>Unlimited</span>
            </div>
            <div className='flex justify-between py-2'>
              <span className='text-gray-500 text-sm'>Payment Method</span>
              <span className='font-semibold text-sm text-gray-400'>None</span>
            </div>
          </div>
          <div className='mt-5 p-4 bg-gray-50 rounded-lg border border-gray-200'>
            <p className='text-sm font-semibold mb-1'>miniChef Pro</p>
            <p className='text-xs text-gray-500 mb-3'>Priority recipe generation, exclusive categories, and more.</p>
            <button className='text-sm font-semibold text-main border border-main rounded px-4 py-1.5 hover:bg-main hover:text-white transition-colors'>
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
