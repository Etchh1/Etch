import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { StatsigWrapper } from '@/lib/statsig-client'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Etch',
  description: 'Etch Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StatsigWrapper>
          {children}
        </StatsigWrapper>
        <Analytics />
      </body>
    </html>
  )
} 