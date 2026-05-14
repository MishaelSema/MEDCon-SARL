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
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://medconsarl.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MEDCon SARL | Premier Construction Company in Cameroon',
    template: '%s | MEDCon SARL',
  },
  description: 'MEDCon SARL is Cameroon\'s leading construction company offering professional building, renovation, interior design, and real estate services in Yaoundé, Douala, and across Cameroon.',
  keywords: [
    // Primary keywords
    'construction company Cameroon',
    'construction company Yaoundé',
    'construction company Douala',
    'building contractor Cameroon',
    'building contractor Yaoundé',
    'construction services Cameroon',
    'construction services Yaoundé',
    // Services
    'construction services Cameroon',
    'building construction Cameroon',
    'commercial construction',
    'residential construction',
    'house construction Cameroon',
    'construction maison Cameroun',
    'construction clé en main Cameroun',
    ' renovation Cameroon',
    'home renovation Yaoundé',
    'office renovation Douala',
    'interior design Cameroon',
    'interior design Yaoundé',
    'interior decoration Cameroon',
    'real estate Cameroon',
    'real estate Yaoundé',
    'property for sale Cameroon',
    'land for sale Yaoundé',
    // French keywords
    'entreprise BTP Cameroun',
    'entrepreneur bâtiment Cameroun',
    'construction immeuble Cameroun',
    'rénovation maison Cameroun',
    'design intérieur Cameroun',
    'immobilier Cameroun Yaoundé',
    // Location-based
    'construction Yaoundé Cameroon',
    'construction Douala Cameroon',
    'contractor Yaoundé Cameroon',
    'builder Cameroon',
    'builders in Yaoundé',
    'best construction company Cameroon',
    'top construction company Cameroon',
    'affordable construction Cameroon',
    // Industry terms
    'civil engineering Cameroon',
    'project management Cameroon',
    'building permit Cameroon',
    'construction estimate Cameroon',
    'construction cost Cameroon',
    'building materials Cameroon',
    'MEDCon SARL Cameroon',
  ],
  authors: [{ name: 'MEDCon SARL', url: SITE_URL }],
  creator: 'MEDCon SARL',
  publisher: 'MEDCon SARL',
  category: 'Construction',
  classification: 'Business',
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
    description: 'Expert construction, renovation, interior design & real estate services. 5+ years experience building across Cameroon. Get your free quote today.',
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'MEDCon SARL - Premier Construction Company in Cameroon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MEDConSARL',
    creator: '@MEDConSARL',
    title: 'MEDCon SARL | Premier Construction Company in Cameroon',
    description: 'Expert construction, renovation, interior design & real estate services. 5+ years experience building across Cameroon.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-US': SITE_URL,
      'fr-CM': `${SITE_URL}/?lang=fr`,
    },
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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MEDCon SARL" />
        <meta name="application-name" content="MEDCon SARL" />
        <script
          dangerouslySetInnerHTML={{
            __html: `var _smartsupp = _smartsupp || {}; _smartsupp.key = 'a34857450c4779f4666f8eec847186481206a88c'; window.smartsupp||(function(d) { var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[]; s=d.getElementsByTagName('script')[0];c=d.createElement('script'); c.type='text/javascript';c.charset='utf-8';c.async=true; c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s); })(document);`
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <StructuredData />
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <NewsletterPopup />
          <Toaster position="top-center" />
        </LanguageProvider>
      </body>
    </html>
  )
}