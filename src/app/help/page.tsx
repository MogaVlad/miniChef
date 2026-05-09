'use client'

import React, { useState } from 'react'

const FAQ_ITEMS = [
  {
    question: 'How does miniChef generate recipes?',
    answer:
      'miniChef uses artificial intelligence to analyze the ingredients you provide and generate complete, step-by-step recipes. Simply type your available ingredients into the search bar on the home page and our AI will do the rest.',
  },
  {
    question: 'Is miniChef free to use?',
    answer:
      'Yes! miniChef is completely free. You can generate unlimited recipes, browse categories, and explore community submissions at no cost.',
  },
  {
    question: 'Can I save my favorite recipes?',
    answer:
      'Absolutely. Once you join the community, you can bookmark recipes, leave reviews, and build your personal recipe collection.',
  },
  {
    question: 'How do I join the community?',
    answer:
      'Click "Enter the Community" on the home page to sign up. Once registered, you can submit your own recipes, review others\' creations, and interact with fellow food enthusiasts.',
  },
  {
    question: 'What recipe categories are available?',
    answer:
      'We offer a wide variety of categories including Breakfast, Soups, Salads, Dinner, Desserts, Quick Meals, Lunchbox, and Vegetarian options.',
  },
  {
    question: 'Can I submit my own recipes?',
    answer:
      'Yes! Community members can submit their own recipes for others to discover and enjoy. Simply join the community and use the "Add Recipes" feature.',
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className='border-b border-gray-200'>
      <button
        onClick={() => setOpen(!open)}
        className='w-full flex justify-between items-center py-5 text-left'
      >
        <span className='text-lg font-medium'>{question}</span>
        <span className='text-2xl text-main ml-4'>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p className='pb-5 text-gray-600 leading-relaxed'>{answer}</p>
      )}
    </div>
  )
}

export default function HelpPage() {
  return (
    <main className='min-h-screen'>
      <section className='bg-main text-white py-12'>
        <div className='container mx-auto px-6 text-center'>
          <h1 className='text-4xl font-semibold mb-2'>Help & Support</h1>
          <p className='text-xl max-w-2xl mx-auto'>
            Have a question or need assistance? We&apos;re here to help.
          </p>
        </div>
      </section>

      <section className='bg-white py-16'>
        <div className='container mx-auto px-6 max-w-3xl'>
          <h2 className='text-3xl font-semibold mb-8 text-center'>Frequently Asked Questions</h2>
          <div>
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      <section className='bg-gray-100 py-16'>
        <div className='container mx-auto px-6 max-w-3xl'>
          <h2 className='text-3xl font-semibold mb-8 text-center'>Contact Us</h2>
          <p className='text-lg text-gray-700 text-center mb-10'>
            Can&apos;t find what you&apos;re looking for? Reach out to us directly
            and we&apos;ll get back to you as soon as possible.
          </p>
          <form className='flex flex-col gap-6'>
            <div className='flex gap-6'>
              <div className='flex-1'>
                <label className='block text-sm font-medium mb-2'>Name</label>
                <input
                  type='text'
                  placeholder='Your name'
                  className='w-full border-2 border-gray-300 rounded px-4 py-3 outline-none focus:border-main transition-colors'
                />
              </div>
              <div className='flex-1'>
                <label className='block text-sm font-medium mb-2'>Email</label>
                <input
                  type='email'
                  placeholder='your@email.com'
                  className='w-full border-2 border-gray-300 rounded px-4 py-3 outline-none focus:border-main transition-colors'
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Subject</label>
              <input
                type='text'
                placeholder='What is this about?'
                className='w-full border-2 border-gray-300 rounded px-4 py-3 outline-none focus:border-main transition-colors'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Message</label>
              <textarea
                rows={5}
                placeholder='Tell us how we can help...'
                className='w-full border-2 border-gray-300 rounded px-4 py-3 outline-none focus:border-main transition-colors resize-none'
              />
            </div>
            <button
              type='button'
              className='bg-main text-white font-semibold py-3 px-10 rounded self-center border-2 border-main hover:bg-white hover:text-main transition-colors'
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section className='bg-white py-16'>
        <div className='container mx-auto px-6 max-w-3xl text-center'>
          <h2 className='text-3xl font-semibold mb-6'>Other Ways to Reach Us</h2>
          <div className='flex gap-10 justify-center'>
            <div className='flex flex-col items-center gap-2'>
              <div className='w-16 h-16 rounded-full bg-main flex items-center justify-center text-white text-2xl'>
                &#9993;
              </div>
              <h3 className='font-semibold'>Email</h3>
              <p className='text-gray-600'>support@minichef.com</p>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <div className='w-16 h-16 rounded-full bg-main flex items-center justify-center text-white text-2xl'>
                &#9742;
              </div>
              <h3 className='font-semibold'>Phone</h3>
              <p className='text-gray-600'>+40 123 456 789</p>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <div className='w-16 h-16 rounded-full bg-main flex items-center justify-center text-white text-2xl'>
                &#9899;
              </div>
              <h3 className='font-semibold'>Social Media</h3>
              <p className='text-gray-600'>@minichef on all platforms</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
