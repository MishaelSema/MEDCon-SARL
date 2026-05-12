'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Ruler, ArrowRight, Loader2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface BilingualField {
    en: string
    fr: string
}

interface FeaturesBilingual {
    en: string[]
    fr: string[]
}

interface Project {
    _id: string
    title: string | BilingualField
    scope: string
    location: string
    year: string
    area: string
    description: string | BilingualField
    features: string[] | FeaturesBilingual
    images: string[]
    mainImage: string
}

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
    const { id } = params
    const { t, language } = useLanguage()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch('/api/admin/projects')
                if (res.ok) {
                    const projects = await res.json()
                    const found = projects.find((p: Project) => p._id === id)
                    setProject(found || null)
                }
            } catch (error) {
                console.error('Error fetching project:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [id])

    const getLocalizedText = (text: string | BilingualField): string => {
        if (typeof text !== 'object' || text === null) return String(text || '')
        return language === 'fr' ? (text.fr || text.en || '') : (text.en || '')
    }

    const getLocalizedFeatures = (features: string[] | FeaturesBilingual): string[] => {
        if (!features) return []
        if (Array.isArray(features)) return features
        return language === 'fr' ? (features.fr || []) : (features.en || [])
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-deep-space-blue-600" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
                    <Link href="/portfolio" className="text-deep-space-blue-600 hover:underline font-medium">
                        Back to Portfolio
                    </Link>
                </div>
            </div>
        )
    }

    const images = project.images?.length > 0 ? project.images : (project.mainImage ? [project.mainImage] : [])
    const mainImage = images[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop'
    const title = getLocalizedText(project.title)
    const description = getLocalizedText(project.description)
    const features = getLocalizedFeatures(project.features)

    return (
        <div className="min-h-screen">
            <section className="relative h-[50vh] overflow-hidden">
                <Image
                    src={mainImage}
                    alt={title}
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
                                {project.scope}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                {title}
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
                                        src={mainImage}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        {language === 'en' ? 'Project Description' : 'Description du Projet'}
                                    </h2>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        {description || project.scope}
                                    </p>
                                </div>

                                {features.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            {language === 'en' ? 'Key Features' : 'Caracteristiques Cles'}
                                        </h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-3 bg-cornsilk-50 px-4 py-3 rounded-xl">
                                                    <div className="w-2 h-2 bg-yellow-green-500 rounded-full"></div>
                                                    <span className="text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {images.length > 1 && (
                                    <div className="grid grid-cols-3 gap-4 mt-8">
                                        {images.slice(1).map((img, i) => (
                                            <div key={i} className="relative h-48 rounded-xl overflow-hidden shadow-md">
                                                <Image
                                                    src={img}
                                                    alt={`${title} ${i + 2}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                        {project.location && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-deep-space-blue-100 rounded-xl flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-deep-space-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">{t('portfolio.location')}</p>
                                                    <p className="font-medium text-gray-900">{project.location}</p>
                                                </div>
                                            </div>
                                        )}

                                        {project.year && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-deep-space-blue-100 rounded-xl flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-deep-space-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">{t('portfolio.year')}</p>
                                                    <p className="font-medium text-gray-900">{project.year}</p>
                                                </div>
                                            </div>
                                        )}

                                        {project.area && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-deep-space-blue-100 rounded-xl flex items-center justify-center">
                                                    <Ruler className="w-5 h-5 text-deep-space-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">{language === 'en' ? 'Area' : 'Superficie'}</p>
                                                    <p className="font-medium text-gray-900">{project.area}m2</p>
                                                </div>
                                            </div>
                                        )}

                                        {project.scope && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-yellow-green-100 rounded-xl flex items-center justify-center">
                                                    <Ruler className="w-5 h-5 text-yellow-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">{t('portfolio.scope')}</p>
                                                    <p className="font-medium text-gray-900">{project.scope}</p>
                                                </div>
                                            </div>
                                        )}
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