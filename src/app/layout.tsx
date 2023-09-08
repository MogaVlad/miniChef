import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'youChef',
  description: 'youChef is an app that generates recipes based of AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar/>
        {children}
        <Footer/>
      </body>
    </html>
  )
}
