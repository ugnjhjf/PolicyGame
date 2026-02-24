import type { Metadata, Viewport } from 'next'
import '../styles/global/globals.css'
import PageTransitionProvider from '../components/PageTransitionProvider'
import ClickFeedback from '../components/ClickSound'

import { inter, poppins } from '../lib/fonts'

export const metadata: Metadata = {
  title: 'AI Policing Strategist | Rokidna',
  description: 'AI-powered policing strategy simulation game',
  generator: 'Next.js',
  keywords: ['AI', 'policing', 'simulation', 'strategy', 'game'],
  authors: [{ name: 'PolicyGame Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#667eea',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
      </head>
      <body suppressHydrationWarning={true} className={inter.className}>
        <ClickFeedback />
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  )
}
