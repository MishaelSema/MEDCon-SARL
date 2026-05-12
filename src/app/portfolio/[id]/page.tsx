'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Ruler, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const projects = {
    'villa-yaounde': {
        title: { en: 'Residential Villa', fr: 'Villa Résidentielle' },
        category: 'residential',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop',
        ],
        location: 'Yaoundé, Cameroon',
        year: '2023',
        scope: { en: 'Full Construction', fr: 'Construction Complète' },
        area: { en: '450 m²', fr: '450 m²' },
        description: {
            en: 'A modern 4-bedroom residential villa featuring contemporary architecture, open floor plans, and premium finishes throughout. This project showcases our commitment to quality construction and attention to detail.',
            fr: 'Une villa résidentielle moderne de 4 chambres avec une architecture contemporaine, des plans ouverts et des finitions premium. Ce projet démontre notre engagement envers la qualité et le détail.',
        },
        features: {
            en: ['4 Bedrooms with en-suite bathrooms', 'Open concept living areas', 'Modern kitchen with premium appliances', 'Infinity pool', 'Smart home integration', 'Double garage'],
            fr: ['4 Chambres avec salles de bain privées', 'Espaces de vie ouverts', 'Cuisine moderne avec équipements premium', 'Piscine à débordement', 'Intégration domotique', 'Double garage'],
        },
    },
    'office-complex': {
        title: { en: 'Office Complex', fr: 'Complexe de Bureaux' },
        category: 'commercial',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop',
        ],
        location: 'Douala, Cameroon',
        year: '2023',
        scope: { en: 'Commercial Development', fr: 'Développement Commercial' },
        area: { en: '2,500 m²', fr: '2 500 m²' },
        description: {
            en: 'A multi-story office complex with modern amenities, sustainable design, and premium workspace solutions for businesses. Built to meet the growing demand for professional spaces in Cameroon\'s economic hub.',
            fr: 'Un complexe de bureaux multi-étages avec des équipements modernes, un design durable et des espaces de travail premium. Construit pour répondre à la demande croissante d\'espaces professionnels à Douala.',
        },
        features: {
            en: ['5 Floors of office space', 'Underground parking', 'Central air conditioning', 'Fiber optic connectivity', 'Conference rooms', 'Rooftop terrace'],
            fr: ['5 Étages de bureaux', 'Parking souterrain', 'Climatisation centrale', 'Connectivité fibre optique', 'Salles de conférence', 'Terrasse sur le toit'],
        },
    },
    'modern-apartment': {
        title: { en: 'Modern Apartment', fr: 'Appartement Moderne' },
        category: 'residential',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
        ],
        location: 'Yaoundé, Cameroon',
        year: '2022',
        scope: { en: 'Interior Design', fr: 'Design d\'Intérieur' },
        area: { en: '180 m²', fr: '180 m²' },
        description: {
            en: 'Luxury apartment interior redesign featuring smart home integration, custom storage solutions, and elegant finishes. Transformed a dated space into a modern, functional home.',
            fr: 'Redesign d\'intérieur d\'appartement de luxe avec intégration domotique, solutions de rangement sur mesure et finitions élégantes. Un espace vieillissant transformé en maison moderne et fonctionnelle.',
        },
        features: {
            en: ['Open plan living', 'Custom built-in furniture', 'Smart lighting system', 'Designer kitchen', 'Walk-in wardrobes', 'Premium bathroom finishes'],
            fr: ['Plan ouvert', 'Mobilier intégré sur mesure', 'Système d\'éclairage intelligent', 'Cuisine design', 'Dressing walk-in', 'Finitions salle de bain premium'],
        },
    },
    'shopping-center': {
        title: { en: 'Shopping Center', fr: 'Centre Commercial' },
        category: 'commercial',
        image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=800&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=800&fit=crop',
        ],
        location: 'Bamenda, Cameroon',
        year: '2022',
        scope: { en: 'Retail Construction', fr: 'Construction Commerciale' },
        area: { en: '5,000 m²', fr: '5 000 m²' },
        description: {
            en: 'A modern shopping center with retail spaces, food court, and parking facilities serving the local community. Built to support local businesses and provide a modern shopping experience.',
            fr: 'Un centre commercial moderne avec des espaces commerciaux, une food court et des parkings au service de la communauté locale. Construit pour soutenir les entreprises locales.',
        },
        features: {
            en: ['50+ Retail units', 'Food court with 10 vendors', '200 parking spaces', 'Security system', 'Central courtyard', 'Loading docks'],
            fr: ['Plus de 50 boutiques', 'Food court avec 10 vendeurs', '200 places de parking', 'Système de sécurité', 'Cour centrale', 'Quais de chargement'],
        },
    },
    'home-renovation': {
        title: { en: 'Home Renovation', fr: 'Rénovation de Maison' },
        category: 'renovation',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop',
        ],
        location: 'Yaoundé, Cameroon',
        year: '2023',
        scope: { en: 'Full Renovation', fr: 'Rénovation Complète' },
        area: { en: '320 m²', fr: '320 m²' },
        description: {
            en: 'Complete home transformation including structural repairs, modern kitchen, updated bathrooms, and exterior refurbishment. Brought new life to a 20-year-old property.',
            fr: 'Transformation complète de maison incluant réparations structurelles, cuisine moderne, salles de bain rénovées et rénovation extérieure. Une propriété de 20 ans rajeunie.',
        },
        features: {
            en: ['Structural reinforcement', 'New electrical system', 'Modern plumbing', 'Updated kitchen', 'Renovated bathrooms', 'Exterior painting'],
            fr: ['Renforcement structurel', 'Nouveau système électrique', 'Plomberie moderne', 'Cuisine modernisée', 'Salles de bain rénovées', 'Peinture extérieure'],
        },
    },
    'estate-construction': {
        title: { en: 'Estate Construction', fr: 'Construction de Domaine' },
        category: 'residential',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
        ],
        location: 'Kribi, Cameroon',
        year: '2021',
        scope: { en: 'Luxury Residence', fr: 'Résidence de Luxe' },
        area: { en: '600 m²', fr: '600 m²' },
        description: {
            en: 'A beachfront luxury estate featuring tropical design, infinity pool, outdoor entertaining areas, and premium materials. Our flagship residential project.',
            fr: 'Un domaine de luxe en bord de mer avec design tropical, piscine à débordement, espaces de divertissement extérieurs et matériaux premium. Notre projet résidentiel phare.',
        },
        features: {
            en: ['Beachfront location', 'Infinity pool', 'Outdoor kitchen', 'Guest house', 'Private beach access', 'Landscaped gardens'],
            fr: ['Emplacement en bord de mer', 'Piscine à débordement', 'Cuisine extérieure', 'Maison d\'hôtes', 'Accès plage privé', 'Jardins paysagers'],
        },
    },
    'warehouse-facility': {
        title: { en: 'Warehouse Facility', fr: 'Entrepôt Industriel' },
        category: 'commercial',
        image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&h=800&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop',
        ],
        location: 'Douala, Cameroon',
        year: '2022',
        scope: { en: 'Industrial Construction', fr: 'Construction Industrielle' },
        area: { en: '4,000 m²', fr: '4 000 m²' },
        description: {
            en: 'Modern industrial warehouse with loading docks, climate control, and efficient storage solutions for logistics operations. Built to support regional supply chain needs.',
            fr: 'Entrepôt industriel moderne avec quais de chargement, contrôle climatique et solutions de stockage efficaces pour opérations logistiques. Construit pour soutenir la chaîne d\'approvisionnement régionale.',
        },
        features: {
            en: ['10 Loading docks', 'Climate controlled zones', 'Mezzanine storage', 'Office space', 'Security systems', 'Generator backup'],
            fr: ['10 Quais de chargement', 'Zones climatisées', 'Stockage en mezzanine', 'Espaces de bureau', 'Systèmes de sécurité', 'Générateur de secours'],
        },
    },
    'bathroom-remodeling': {
        title: { en: 'Bathroom Remodeling', fr: 'Rénovation de Salle de Bain' },
        category: 'renovation',
        image: 'https://images.unsplash.com/photo-1552321554-c5ee4ef1d7b6?w=1200&h=800&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1552321554-c5ee4ef1d7b6?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&h=800&fit=crop',
        ],
        location: 'Yaoundé, Cameroon',
        year: '2023',
        scope: { en: 'Bathroom Renovation', fr: 'Rénovation de Salle de Bain' },
        area: { en: '25 m²', fr: '25 m²' },
        description: {
            en: 'Spa-like bathroom renovation featuring walk-in shower, modern fixtures, heated flooring, and premium tilework. Created a luxurious retreat within the home.',
            fr: 'Rénovation de salle de bain tipo spa avec douche à l\'italienne, équipements modernes, plancher chauffant et carrelage premium. Un havre de paix luxueux.',
        },
        features: {
            en: ['Walk-in rain shower', 'Heated floors', 'Double vanity', 'Premium fixtures', 'Ambient lighting', 'Premium tilework'],
            fr: ['Douche à l\'italienne', 'Plancher chauffant', 'Double vasque', 'Équipements premium', 'Éclairage d\'ambiance', 'Carrelage haut de gamme'],
        },
    },
}

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
    const { id } = params
    const { t, language } = useLanguage()
    const project = projects[id as keyof typeof projects]

    if (!project) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
                    <Link href="/portfolio" className="text-deep-space-blue-600 hover:underline">
                        Back to Portfolio
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-16">
            <section className="relative h-[50vh] overflow-hidden">
                <Image
                    src={project.image}
                    alt={project.title[language as keyof typeof project.title]}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-space-blue-600/60"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-4 py-2 bg-yellow-green-500 text-deep-space-blue-600 font-bold rounded-full mb-4">
                                {t(`portfolio.${project.category}`)}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                {project.title[language as keyof typeof project.title]}
                            </h1>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 text-deep-space-blue-600 hover:text-deep-space-blue-700 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'en' ? 'Back to Portfolio' : 'Retour au Portfolio'}
                    </Link>
                </div>
            </section>

            <section className="pb-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl mb-8">
                                    <Image
                                        src={project.images[0]}
                                        alt={project.title[language as keyof typeof project.title]}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        {language === 'en' ? 'Project Description' : 'Description du Projet'}
                                    </h2>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        {project.description[language as keyof typeof project.description]}
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        {language === 'en' ? 'Key Features' : 'Caractéristiques Clés'}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {project.features[language as keyof typeof project.features].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-cornsilk-50 px-4 py-3 rounded-xl">
                                                <div className="w-2 h-2 bg-yellow-green-500 rounded-full"></div>
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-8">
                                    {project.images.slice(1).map((img, i) => (
                                        <div key={i} className="relative h-48 rounded-xl overflow-hidden shadow-md">
                                            <Image
                                                src={img}
                                                alt={`${project.title[language as keyof typeof project.title]} ${i + 2}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="sticky top-24"
                            >
                                <div className="bg-cornsilk-50 rounded-2xl p-6 shadow-lg">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                                        {t('portfolio.projectDetails')}
                                    </h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-deep-space-blue-100 rounded-xl flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-deep-space-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">{t('portfolio.location')}</p>
                                                <p className="font-medium text-gray-900">{project.location}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-deep-space-blue-100 rounded-xl flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-deep-space-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">{t('portfolio.year')}</p>
                                                <p className="font-medium text-gray-900">{project.year}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-deep-space-blue-100 rounded-xl flex items-center justify-center">
                                                <Ruler className="w-5 h-5 text-deep-space-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">{language === 'en' ? 'Area' : 'Superficie'}</p>
                                                <p className="font-medium text-gray-900">{project.area[language as keyof typeof project.area]}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-yellow-green-100 rounded-xl flex items-center justify-center">
                                                <Ruler className="w-5 h-5 text-yellow-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">{t('portfolio.scope')}</p>
                                                <p className="font-medium text-gray-900">{project.scope[language as keyof typeof project.scope]}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href="/contact"
                                        className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-deep-space-blue-600 text-white font-bold rounded-full hover:bg-deep-space-blue-700 transition-colors"
                                    >
                                        {t('nav.getQuote')}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}