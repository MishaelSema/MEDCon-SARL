import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://medconstruction-cm.com'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  const projects: Record<string, {
    title: { en: string; fr: string }
    description: { en: string; fr: string }
    image: string
    category: string
    location: string
  }> = {
    'villa-yaounde': {
      title: { en: 'Residential Villa in Yaoundé', fr: 'Villa Résidentielle à Yaoundé' },
      description: { en: 'Modern 4-bedroom residential villa with contemporary architecture and premium finishes. View our portfolio of completed projects.', fr: 'Villa résidentielle moderne de 4 chambres avec architecture contemporaine et finitions premium.' },
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
      category: 'residential',
      location: 'Yaoundé, Cameroon',
    },
    'office-complex': {
      title: { en: 'Office Complex in Douala', fr: 'Complexe de Bureaux à Douala' },
      description: { en: 'Multi-story office complex with modern amenities and sustainable design. View our commercial construction projects.', fr: 'Complexe de bureaux multi-étages avec équipements modernes et design durable.' },
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
      category: 'commercial',
      location: 'Douala, Cameroon',
    },
    'modern-apartment': {
      title: { en: 'Modern Apartment Interior', fr: 'Design d\'Intérieur d\'Appartement' },
      description: { en: 'Luxury apartment interior redesign featuring smart home integration and elegant finishes.', fr: 'Redesign d\'intérieur d\'appartement de luxe avec intégration domotique.' },
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      category: 'residential',
      location: 'Yaoundé, Cameroon',
    },
    'shopping-center': {
      title: { en: 'Shopping Center in Bamenda', fr: 'Centre Commercial à Bamenda' },
      description: { en: 'Modern shopping center with retail spaces, food court, and parking facilities.', fr: 'Centre commercial moderne avec espaces commerciaux et food court.' },
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=800&fit=crop',
      category: 'commercial',
      location: 'Bamenda, Cameroon',
    },
    'home-renovation': {
      title: { en: 'Home Renovation in Yaoundé', fr: 'Rénovation de Maison à Yaoundé' },
      description: { en: 'Complete home transformation including structural repairs and modern updates.', fr: 'Transformation complète de maison avec réparations structurelles.' },
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
      category: 'renovation',
      location: 'Yaoundé, Cameroon',
    },
    'estate-construction': {
      title: { en: 'Beachfront Luxury Estate', fr: 'Domaine de Luxe en Bord de Mer' },
      description: { en: 'Beachfront luxury estate featuring tropical design and premium materials. Our flagship project.', fr: 'Domaine de luxe en bord de mer avec design tropical et matériaux premium.' },
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      category: 'residential',
      location: 'Kribi, Cameroon',
    },
    'warehouse-facility': {
      title: { en: 'Industrial Warehouse in Douala', fr: 'Entrepôt Industriel à Douala' },
      description: { en: 'Modern industrial warehouse with loading docks and climate control.', fr: 'Entrepôt industriel moderne avec quais de chargement.' },
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&h=800&fit=crop',
      category: 'commercial',
      location: 'Douala, Cameroon',
    },
    'bathroom-remodeling': {
      title: { en: 'Luxury Bathroom Remodeling', fr: 'Rénovation de Salle de Bain de Luxe' },
      description: { en: 'Spa-like bathroom renovation with walk-in shower and premium fixtures.', fr: 'Rénovation de salle de bain tipo spa avec douche à l\'italienne.' },
      image: 'https://images.unsplash.com/photo-1552321554-c5ee4ef1d7b6?w=1200&h=800&fit=crop',
      category: 'renovation',
      location: 'Yaoundé, Cameroon',
    },
  }

  const project = projects[id]
  
  if (!project) {
    return {
      title: 'Portfolio | MEDCon SARL',
      description: 'View our portfolio of construction and renovation projects in Cameroon.',
    }
  }

  return {
    title: `${project.title.en} | MEDCon SARL Portfolio`,
    description: project.description.en,
    keywords: [`${project.category} construction Cameroon`, 'portfolio', 'completed projects', project.location],
    openGraph: {
      title: project.title.en,
      description: project.description.en,
      url: `${SITE_URL}/portfolio/${id}`,
      siteName: 'MEDCon SARL',
      images: [{ url: project.image, width: 1200, height: 630, alt: project.title.en }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title.en,
      description: project.description.en,
      images: [project.image],
    },
    alternates: {
      canonical: `${SITE_URL}/portfolio/${id}`,
    },
  }
}

export default function PortfolioDetailLayout({ children }: { children: React.ReactNode }) {
  return children
}