import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://medconsarl.com'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Our Services | MEDCon SARL',
    description: 'Explore professional construction, renovation, interior design, real estate, and merchandise services in Cameroon. Quality craftsmanship you can trust.',
    keywords: ['construction services Cameroon', 'renovation Yaoundé', 'interior design Cameroon', 'real estate Cameroon', 'building contractor'],
    openGraph: {
      title: 'Our Services | MEDCon SARL',
      description: 'Professional construction, renovation, interior design, real estate, and merchandise services in Cameroon.',
      url: `${SITE_URL}/services`,
      siteName: 'MEDCon SARL',
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'MEDCon SARL Services' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Our Services | MEDCon SARL',
      description: 'Professional construction and renovation services in Cameroon.',
      images: [`${SITE_URL}/og-image.png`],
    },
    alternates: {
      canonical: `${SITE_URL}/services`,
    },
  }
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}