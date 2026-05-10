'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

import about_1 from '../../assets/about/about-us_1.png'
import about_2 from '../../assets/about/about-us_2.png'
import about_3 from '../../assets/about/about-us_3.png'
import column_photo from '../../assets/banner.jpg'

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

export default function AboutPage() {
  return (
    <main className='min-h-screen'>
      {/* Hero — compact with dot pattern */}
      <section className='relative bg-main text-white py-10 md:py-12 overflow-hidden'>
        <div
          className='absolute inset-0 opacity-10'
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className='container mx-auto px-6 text-center relative'>
          <h1 className='text-3xl md:text-4xl font-semibold mb-2'>About Us</h1>
          <p className='text-base md:text-lg max-w-xl mx-auto opacity-90'>
            We believe everyone deserves a great meal — no matter what&apos;s in the fridge.
          </p>
        </div>
      </section>

      {/* Our Story — two-column */}
      <section className='bg-white py-16'>
        <RevealSection>
          <div className='container mx-auto px-6 max-w-5xl'>
            <h2 className='text-3xl font-semibold mb-10 text-center'>Our Story</h2>
            <div className='flex flex-col md:flex-row gap-10 items-center'>
              <div className='md:w-1/2 space-y-6'>
                <p className='text-lg leading-relaxed text-gray-700'>
                  miniChef was born from a simple idea: cooking should be accessible,
                  creative, and fun. Too often, people stare at a handful of ingredients
                  and wonder what to make. We built an AI-powered recipe engine that
                  turns whatever you have on hand into delicious, step-by-step meals.
                </p>
                <p className='text-lg leading-relaxed text-gray-700'>
                  Whether you&apos;re a seasoned home cook or just getting started in the
                  kitchen, miniChef helps you discover new flavors, reduce food waste,
                  and make every meal count.
                </p>
              </div>
              <div className='md:w-1/2 flex justify-center'>
                <div className='relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden'>
                  <Image src={column_photo} alt='Column photo' fill className='object-cover object-center' />
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Our Mission — pull-quote treatment */}
      <section className='bg-gray-50 py-20'>
        <RevealSection>
          <div className='container mx-auto px-6 max-w-4xl text-center'>
            <h2 className='text-3xl font-semibold mb-10'>Our Mission</h2>
            <div className='relative px-12 md:px-16 py-8'>
              <span className='absolute top-0 left-0 text-[100px] leading-[0.8] text-main opacity-15 font-serif select-none' aria-hidden='true'>
                &#x201C;
              </span>
              <blockquote className='relative z-10'>
                <p className='text-2xl md:text-3xl leading-snug font-semibold italic text-gray-800' style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  To empower home cooks around the world with intelligent tools that make
                  meal planning effortless, reduce food waste, and bring people together
                  through the joy of cooking.
                </p>
              </blockquote>
              <span className='absolute bottom-0 right-0 text-[100px] leading-[0.8] text-main opacity-15 font-serif select-none' aria-hidden='true'>
                &#x201D;
              </span>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* What Makes Us Different */}
      <section className='bg-white py-10 md:py-16'>
        <RevealSection>
          <div className='container mx-auto px-6'>
            <h2 className='text-2xl md:text-3xl font-semibold mb-8 md:mb-10 text-center'>What Makes Us Different</h2>
            <div className='flex flex-col md:flex-row gap-8 md:gap-10 justify-center items-center'>
              <div className='flex flex-col items-center gap-4 max-w-[300px]'>
                <Image src={about_1} alt='AI-powered recipes' className='w-[100px] h-[100px] md:w-[120px] md:h-[120px]' />
                <h3 className='text-main font-semibold text-lg'>AI-Powered Recipes</h3>
                <p className='text-center text-gray-600'>
                  Enter any combination of ingredients and our AI generates
                  complete, chef-quality recipes in seconds.
                </p>
              </div>
              <div className='flex flex-col items-center gap-4 max-w-[300px]'>
                <Image src={about_2} alt='Community driven' className='w-[100px] h-[100px] md:w-[120px] md:h-[120px]' />
                <h3 className='text-main font-semibold text-lg'>Community Driven</h3>
                <p className='text-center text-gray-600'>
                  Share your own recipes, review others&apos; creations, and be part
                  of a growing network of food enthusiasts.
                </p>
              </div>
              <div className='flex flex-col items-center gap-4 max-w-[300px]'>
                <Image src={about_3} alt='Curated categories' className='w-[100px] h-[100px] md:w-[120px] md:h-[120px]' />
                <h3 className='text-main font-semibold text-lg'>Curated Categories</h3>
                <p className='text-center text-gray-600'>
                  Browse breakfast, soups, salads, desserts and more — each
                  category hand-picked by our culinary team.
                </p>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Our Team */}
      <section className='bg-gray-50 py-16'>
        <RevealSection>
          <div className='container mx-auto px-6 max-w-4xl'>
            <h2 className='text-3xl font-semibold mb-10 text-center'>Our Team</h2>
            <div className='flex flex-col items-center text-center'>
              <div className='w-28 h-28 rounded-full bg-main mx-auto mb-4 flex items-center justify-center text-white text-4xl font-semibold'>V</div>
              <h3 className='font-semibold text-xl'>Moga Vlad-Mihai</h3>
              <p className='text-gray-500 mb-4'>Founder & Full-Stack Engineer</p>
              <p className='text-lg leading-relaxed text-gray-700 max-w-xl'>
                A food lover and engineer based in Romania, passionate about using
                technology to solve everyday problems in the kitchen.
              </p>
            </div>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
