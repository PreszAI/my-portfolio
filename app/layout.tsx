import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import Nav from '@/components/Nav'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Your Name — Portfolio',
  description: 'Personal portfolio showcasing projects, experience, and contact information.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Your Name — Portfolio',
    description: 'Personal portfolio showcasing projects, experience, and contact information.',
    url: 'https://example.com',
    siteName: 'Your Name — Portfolio',
    images: [
      { url: '/og.png', width: 1200, height: 630, alt: 'Portfolio' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/25 selection:text-primary-foreground">
        <ThemeProvider>
          <Nav />
          <div className="bg-grid">
            <div className="container">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


