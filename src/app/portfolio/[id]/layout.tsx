import type { Metadata } from 'next'
import { getDatabase } from '@/lib/mongodb'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://medconsarl.com'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  try {
    const db = await getDatabase()
    const projects = await db.collection('projects').find({}).toArray()
    const project = projects.find((p: any) => p._id === id)
    
    if (!project) {
      return {
        title: 'Portfolio | MEDCon SARL',
        description: 'View our portfolio of construction and renovation projects in Cameroon.',
      }
    }

    const title = typeof project.title === 'string' ? project.title : project.title.en
    const description = typeof project.description === 'string' ? project.description : project.description.en
    const image = project.mainImage || project.images?.[0] || `${SITE_URL}/og-image.png`

    return {
      title: `${title} | MEDCon SARL Portfolio`,
      description: description,
      keywords: [project.scope, 'construction Cameroon', 'portfolio', 'completed projects', project.location],
      openGraph: {
        title: title,
        description: description,
        url: `${SITE_URL}/portfolio/${id}`,
        siteName: 'MEDCon SARL',
        images: [{ url: image, width: 1200, height: 630, alt: title }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [image],
      },
      alternates: {
        canonical: `${SITE_URL}/portfolio/${id}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Portfolio | MEDCon SARL',
      description: 'View our portfolio of construction and renovation projects in Cameroon.',
    }
  }
}

export default function PortfolioDetailLayout({ children }: { children: React.ReactNode }) {
  return children
}