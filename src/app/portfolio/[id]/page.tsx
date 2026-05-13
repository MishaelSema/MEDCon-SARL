import { Metadata } from 'next'
import PortfolioDetailContent from '@/components/PortfolioDetailContent'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

const BASE_URL = 'https://medconsarl.com'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    const { getDatabase } = await import('@/lib/mongodb')
    const db = await getDatabase()
    const { ObjectId } = await import('mongodb')
    const project = await db.collection('projects').findOne({ _id: new ObjectId(id) })
    
    if (!project) {
      return { title: 'Project Not Found | MEDCon SARL' }
    }

    const title = typeof project.title === 'object' ? project.title.en : project.title
    const description = typeof project.description === 'object' ? project.description.en : project.description
    const ogImage = project.mainImage || project.images?.[0] || DEFAULT_OG_IMAGE

    return {
      title: `${title} | MEDCon SARL`,
      description: description || `View our ${project.scope} project in ${project.location || 'Cameroon'}. MEDCon SARL - Premier Construction Company.`,
      keywords: [project.scope, project.location, 'construction', 'MEDCon SARL'].filter(Boolean),
      openGraph: {
        title: title,
        description: description || `View our ${project.scope} project in ${project.location || 'Cameroon'}.`,
        url: `${BASE_URL}/portfolio/${id}`,
        siteName: 'MEDCon SARL',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: 'website',
        locale: 'en_US',
        alternateLocale: 'fr_CM',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | MEDCon SARL`,
        description: description || `View our ${project.scope} project in ${project.location || 'Cameroon'}.`,
        images: [ogImage],
        creator: '@MEDConSARL',
      },
      alternates: {
        canonical: `${BASE_URL}/portfolio/${id}`,
        languages: {
          'en-US': `${BASE_URL}/portfolio/${id}`,
          'fr-CM': `${BASE_URL}/portfolio/${id}?lang=fr`,
        },
      },
    }
  } catch (error) {
    return { title: 'Portfolio | MEDCon SARL' }
  }
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { id } = await params
  return <PortfolioDetailContent id={id} />
}