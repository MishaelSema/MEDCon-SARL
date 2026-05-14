import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServicesContent from '../page'

const BASE_URL = 'https://medconsarl.com'

const serviceMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  construction: {
    title: 'Building Construction Services | MEDCon SARL',
    description: 'Professional building construction services in Cameroon. Residential and commercial construction with quality craftsmanship. Get your free quote today.',
    keywords: [
      'building construction Cameroon',
      'house construction Yaoundé',
      'commercial construction Cameroon',
      'residential construction Cameroon',
      'construction company Yaoundé',
      'building contractor Cameroon',
      'construction services Yaoundé',
      'new construction Cameroon',
      'building contractor Yaoundé',
      'construction maison Cameroun',
    ],
  },
  renovation: {
    title: 'Renovation Services | MEDCon SARL',
    description: 'Expert home and office renovation services in Cameroon. Transform your space with quality renovation work. Free consultations available.',
    keywords: [
      'renovation Cameroon',
      'home renovation Yaoundé',
      'office renovation Cameroon',
      'kitchen renovation Cameroon',
      'bathroom renovation Cameroon',
      'renovation services Yaoundé',
      'home renovation Douala',
      'rénovation maison Cameroun',
    ],
  },
  interior: {
    title: 'Interior Design Services | MEDCon SARL',
    description: 'Professional interior design and decoration services in Cameroon. Create beautiful, functional spaces with our expert designers.',
    keywords: [
      'interior design Cameroon',
      'interior design Yaoundé',
      'interior decoration Cameroon',
      'interior designer Yaoundé',
      'office interior design Cameroon',
      'home interior design Cameroon',
      'design intérieur Cameroun',
    ],
  },
  realEstate: {
    title: 'Real Estate Services | MEDCon SARL',
    description: 'Professional real estate management and property services in Cameroon. Find properties for sale and rent in Yaoundé and Douala.',
    keywords: [
      'real estate Cameroon',
      'real estate Yaoundé',
      'property for sale Cameroon',
      'land for sale Yaoundé',
      'house for sale Cameroon',
      'apartments for rent Yaoundé',
      'immobilier Cameroun Yaoundé',
    ],
  },
  generalMerchandise: {
    title: 'Construction Materials & Merchandise | MEDCon SARL',
    description: 'Quality construction materials and general merchandise for your building projects in Cameroon. Everything you need for your construction.',
    keywords: [
      'construction materials Cameroon',
      'building materials Yaoundé',
      'construction supplies Cameroon',
      'building supplies Yaoundé',
      'construction materials for sale',
      'materiaux construction Cameroun',
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params
  const meta = serviceMetadata[service]

  if (!meta) {
    return { title: 'Service Not Found | MEDCon SARL' }
  }

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${BASE_URL}/services/${service}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE_URL}/services/${service}`,
      siteName: 'MEDCon SARL',
      type: 'website',
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [`${BASE_URL}/og-image.png`],
    },
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params
  
  if (!serviceMetadata[service]) {
    notFound()
  }

  return <ServicesContent />
}