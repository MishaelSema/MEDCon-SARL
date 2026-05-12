import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import NewsletterPopup from '@/components/NewsletterPopup'
import StructuredData from '@/components/StructuredData'
import { LanguageProvider } from '@/context/LanguageContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://medconstruction-cm.com'),
  title: {
    default: 'MEDCon SARL | Premier Construction Company in Cameroon',
    template: '%s | MEDCon SARL',
  },
  description: 'MEDCon SARL offers professional construction, renovation, and real estate services in Yaoundé, Cameroon. Modern engineering, quality craftsmanship, trusted results.',
  keywords: [
    'construction company Cameroon',
    'building contractor Yaoundé',
    'construction services Cameroon',
    'renovation Cameroon',
    'real estate Cameroon',
    'construction company Douala',
    'entreprise BTP Cameroun',
    'construction maison Cameroun',
    'entrepreneur bâtiment',
    'construction clé en main',
    'MEDCon SARL Cameroon',
    'building construction Cameroon',
    'commercial construction',
    'residential construction',
    'construction services Yaoundé',
  ],
  authors: [{ name: 'MEDCon SARL' }],
  creator: 'MEDCon SARL',
  publisher: 'MEDCon SARL',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fr_CM',
    siteName: 'MEDCon SARL',
    title: 'MEDCon SARL | Premier Construction Company in Cameroon',
    description: 'MEDCon SARL offers professional construction, renovation, and real estate services in Yaoundé, Cameroon. Modern engineering, quality craftsmanship.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MEDCon SARL - Building Tomorrow\'s Dreams Today',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEDCon SARL | Premier Construction Company in Cameroon',
    description: 'Professional construction services in Yaoundé, Cameroon. Quality craftsmanship you can trust.',
    images: ['/og-image.png'],
    creator: '@MEDConSARL',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/og-image.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#073856" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <StructuredData />
          <Navigation />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
          <WhatsAppButton />
          <NewsletterPopup />
          <Toaster position="top-center" />
        </LanguageProvider>
      </body>
    </html>
  )
}