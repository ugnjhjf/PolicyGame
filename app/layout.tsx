import type { Metadata, Viewport } from 'next'
import '../styles/global/globals.css'
import PageTransitionProvider from '../components/PageTransitionProvider'
import PerformanceMonitor from '../components/PerformanceMonitor'
import { inter, poppins } from '../lib/fonts'

export const metadata: Metadata = {
  title: 'Predictive Policing Simulation',
  description: 'AI-powered policing strategy simulation game',
  generator: 'Next.js',
  keywords: ['AI', 'policing', 'simulation', 'strategy', 'game'],
  authors: [{ name: 'PolicyGame Team' }],
  themeColor: '#667eea',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
        <PerformanceMonitor />
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  )
}
