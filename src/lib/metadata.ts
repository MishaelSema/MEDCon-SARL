import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://medconstruction-cm.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

export const generateMetadata = (): Metadata => {
  return {
    metadataBase: new URL(SITE_URL),
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
          url: DEFAULT_OG_IMAGE,
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
      images: [DEFAULT_OG_IMAGE],
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
    alternates: {
      canonical: SITE_URL,
      languages: {
        'en-US': SITE_URL,
        'fr-CM': `${SITE_URL}/?lang=fr`,
      },
    },
  }
}

export const getMetadataForService = async (serviceId: string) => {
  const res = await fetch(`${SITE_URL}/api/admin/services`)
  const services = await res.json()
  const service = services.find((s: any) => s._id === serviceId)

  if (!service) {
    return {
      title: 'Our Services | MEDCon SARL',
      description: 'Explore our professional construction, renovation, interior design, real estate, and merchandise services in Cameroon.',
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    }
  }

  const image = service.images?.[0] || DEFAULT_OG_IMAGE
  const title = typeof service.title === 'string' ? service.title : service.title.en

  return {
    title: `${title} Services | MEDCon SARL`,
    description: service.description?.en || service.description || `Professional ${title.toLowerCase()} services in Cameroon by MEDCon SARL.`,
    images: [{ url: image, width: 1200, height: 630, alt: title }],
    openGraph: {
      title: `${title} Services | MEDCon SARL`,
      description: service.description?.en || service.description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [image],
    },
  }
}

export const getMetadataForProject = (project: {
  id: string
  title: { en: string; fr: string }
  description: { en: string; fr: string }
  image: string
  category: string
  location: string
}) => {
  return {
    title: `${project.title.en} | MEDCon SARL Portfolio`,
    description: project.description.en,
    images: [{ url: project.image, width: 1200, height: 630, alt: project.title.en }],
    openGraph: {
      title: `${project.title.en} | MEDCon SARL`,
      description: project.description.en,
      images: [{ url: project.image, width: 1200, height: 630, alt: project.title.en }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      images: [project.image],
    },
  }
}