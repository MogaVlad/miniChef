import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { SavedRecipesProvider } from '@/context/SavedRecipesContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'miniChef',
  description: 'miniChef is an app that generates recipes based on AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SavedRecipesProvider>
          <NavBar/>
          {children}
          <Footer/>
        </SavedRecipesProvider>
      </body>
    </html>
  )
}
