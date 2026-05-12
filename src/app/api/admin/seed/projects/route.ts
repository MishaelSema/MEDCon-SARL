import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_PROJECTS = [
    {
        title: { en: 'Residential Villa', fr: 'Villa Résidentielle' },
        scope: 'New Construction',
        location: 'Yaoundé, Cameroon',
        year: '2024',
        area: '450',
        description: {
            en: 'A modern 4-bedroom residential villa featuring contemporary architecture, open floor plans, and premium finishes throughout. This project showcases our commitment to quality construction.',
            fr: 'Une villa résidentielle moderne de 4 chambres avec une architecture contemporaine, des plans ouverts et des finitions premium.',
        },
        features: {
            en: ['4 Bedrooms with en-suite bathrooms', 'Open concept living areas', 'Modern kitchen', 'Double garage'],
            fr: ['4 Chambres avec salles de bain privées', 'Espaces de vie ouverts', 'Cuisine moderne', 'Double garage'],
        },
        images: [],
        mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
        status: 'active',
    },
    {
        title: { en: 'Office Complex', fr: 'Complexe de Bureaux' },
        scope: 'Commercial',
        location: 'Douala, Cameroon',
        year: '2024',
        area: '2500',
        description: {
            en: 'A multi-story office complex with modern amenities, sustainable design, and premium workspace solutions.',
            fr: 'Un complexe de bureaux multi-étages avec des équipements modernes et un design durable.',
        },
        features: {
            en: ['5 Floors of office space', 'Underground parking', 'Conference rooms'],
            fr: ['5 Étages de bureaux', 'Parking souterrain', 'Salles de conférence'],
        },
        images: [],
        mainImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
        status: 'active',
    },
    {
        title: { en: 'Modern Apartment', fr: 'Appartement Moderne' },
        scope: 'Interior Design',
        location: 'Yaoundé, Cameroon',
        year: '2023',
        area: '180',
        description: {
            en: 'Luxury apartment interior redesign featuring smart home integration and elegant finishes.',
            fr: 'Redesign d\'appartement de luxe avec intégration domotique et finitions élégantes.',
        },
        features: {
            en: ['Open plan living', 'Smart lighting system', 'Designer kitchen'],
            fr: ['Plan ouvert', 'Système d\'éclairage intelligent', 'Cuisine design'],
        },
        images: [],
        mainImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
        status: 'active',
    },
    {
        title: { en: 'Shopping Center', fr: 'Centre Commercial' },
        scope: 'Commercial',
        location: 'Bamenda, Cameroon',
        year: '2023',
        area: '5000',
        description: {
            en: 'A modern shopping center with retail spaces and parking facilities serving the local community.',
            fr: 'Un centre commercial moderne avec des espaces commerciaux et des parkings.',
        },
        features: {
            en: ['50+ Retail units', 'Food court', '200 parking spaces'],
            fr: ['Plus de 50 boutiques', 'Food court', '200 places de parking'],
        },
        images: [],
        mainImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=800&fit=crop',
        status: 'active',
    },
    {
        title: { en: 'Home Renovation', fr: 'Rénovation de Maison' },
        scope: 'Renovation',
        location: 'Yaoundé, Cameroon',
        year: '2023',
        area: '320',
        description: {
            en: 'Complete home transformation including structural repairs and modern updates.',
            fr: 'Transformation complète de maison incluant réparations structurelles.',
        },
        features: {
            en: ['Structural reinforcement', 'New electrical system', 'Updated kitchen'],
            fr: ['Renforcement structurel', 'Nouveau système électrique', 'Cuisine modernisée'],
        },
        images: [],
        mainImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
        status: 'active',
    },
]

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { getDatabase } = await import('@/lib/mongodb')
        const db = await getDatabase()

        await db.collection('projects').deleteMany({})

        const projectsToInsert = DEFAULT_PROJECTS.map(p => ({
            ...p,
            createdAt: new Date(),
        }))

        await db.collection('projects').insertMany(projectsToInsert)

        return NextResponse.json({ success: true, count: DEFAULT_PROJECTS.length })
    } catch (error) {
        console.error('Seed projects error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}