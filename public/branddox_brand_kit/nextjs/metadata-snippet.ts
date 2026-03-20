import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Branddox',
  description: 'Branding design studio',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Branddox',
    description: 'Branding design studio',
    images: ['/og-image.png'],
  },
}
