import type { Metadata, Viewport } from 'next'
import '../styles/global/globals.css'
import PageTransitionProvider from '../components/PageTransitionProvider'

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
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body suppressHydrationWarning={true} className={inter.className}>

        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  )
}
