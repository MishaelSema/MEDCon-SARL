'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowRight, Loader2 } from 'lucide-react'

interface Project {
    _id: string
    title: string | { en: string; fr: string }
    scope: string
    category: string
    image: string
    mainImage?: string
    location: string
    year: string
    area?: string
    description: string | { en: string; fr: string }
    serviceIds?: string[]
}

interface Service {
    _id: string
    title: string | { en: string; fr: string }
}

export default function PortfolioPage() {
    const { t, language } = useLanguage()
    const [activeFilter, setActiveFilter] = useState('all')
    const [projects, setProjects] = useState<Project[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [projectsRes, servicesRes] = await Promise.all([
                fetch('/api/admin/projects'),
                fetch('/api/admin/services')
            ])
            if (projectsRes.ok) {
                setProjects(await projectsRes.json())
            }
            if (servicesRes.ok) {
                setServices(await servicesRes.json())
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getLocalizedText = (text: string | { en: string; fr: string }) => {
        if (typeof text === 'string') return text
        return language === 'fr' ? (text.fr || text.en) : (text.en || text)
    }

    const getServiceTitle = (service: Service) => getLocalizedText(service.title)

    const filteredProjects = activeFilter === 'all'
        ? projects
        : projects.filter(p => {
            // Check serviceIds first (new projects)
            if (p.serviceIds?.length) {
                return p.serviceIds.includes(activeFilter)
            }
            // Fallback to scope (existing projects)
            return p.scope === activeFilter
        })

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-deep-space-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <section className="relative h-[60vh] flex items-center justify-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&h=1080&fit=crop"
                        alt="Portfolio"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-deep-space-blue-600/70"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-yellow-green-400 font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
                            {t('portfolio.subtitle')}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">{t('portfolio.title')}</h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">{t('portfolio.description')}</p>
                    </motion.div>
                </div>
            </section>

            <section className="py-12 bg-cornsilk-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${
                                activeFilter === 'all'
                                    ? 'bg-deep-space-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-deep-space-blue-50'
                            }`}
                        >
                            {t('portfolio.all')}
                        </button>
                        {services.map((service) => (
                            <button
                                key={service._id}
                                onClick={() => setActiveFilter(service._id)}
                                className={`px-6 py-3 rounded-full font-medium transition-all ${
                                    activeFilter === service._id
                                        ? 'bg-deep-space-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-deep-space-blue-50'
                                }`}
                            >
                                {String(getServiceTitle(service))}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-cornsilk-50">
                <div className="max-w-7xl mx-auto px-4">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">
                                {language === 'en' ? 'No projects found.' : 'Aucun projet trouvé.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <Link href={`/portfolio/${project._id}`} className="block">
                                        <div className="relative h-72 overflow-hidden rounded-2xl shadow-lg">
                                            <Image
                                                src={project.mainImage || project.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop'}
                                                alt={String(getLocalizedText(project.title))}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform">
                                                <span className="inline-block px-3 py-1 bg-yellow-green-500 text-deep-space-blue-600 text-sm font-bold rounded-full mb-2">
                                                    {p.serviceIds?.length 
                                                        ? String(getServiceTitle(services.find(s => s._id === p.serviceIds?.[0]) || { _id: '', title: p.scope } as Service))
                                                        : p.scope}
                                                </span>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white text-sm">{project.location}</span>
                                                    <ArrowRight className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <h3 className="text-xl font-bold text-gray-900">{String(getLocalizedText(project.title))}</h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span>{project.year}</span>
                                                <span>{project.scope}</span>
                                                {project.area && <span>{project.area}m²</span>}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-20 bg-deep-space-blue-600 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {language === 'en' ? 'Your Project Could Be Next' : 'Votre Projet Pourrait Être le Prochain'}
                        </h2>
                        <p className="text-lg text-white/80 mb-8">
                            {language === 'en'
                                ? 'Ready to start your construction journey? Contact us today for a free consultation.'
                                : 'Prêt à démarrer votre projet de construction? Contactez-nous aujourd\'hui pour une consultation gratuite.'}
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-green-500 text-deep-space-blue-600 font-bold rounded-full hover:bg-yellow-green-400 transition-colors"
                        >
                            {t('nav.getQuote')}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}