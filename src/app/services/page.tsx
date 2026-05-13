'use client'

import { Suspense, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle, Phone, Mail, Loader2, ZoomIn } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import ImageLightbox from '@/components/ImageLightbox'

interface Service {
    _id: string
    title: string | { en: string; fr: string }
    description: string | { en: string; fr: string }
    features: string[]
    images: string[]
    icon?: string
    projectIds?: string[]
}

interface Project {
    _id: string
    title: string | { en: string; fr: string }
    mainImage: string
    location: string
}

function ServicesContent() {
    const { t, language } = useLanguage()
    const searchParams = useSearchParams()
    const [activeIndex, setActiveIndex] = useState(0)
    const [services, setServices] = useState<Service[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [servicesRes, projectsRes] = await Promise.all([
                fetch('/api/admin/services'),
                fetch('/api/admin/projects')
            ])
            if (servicesRes.ok) {
                setServices(await servicesRes.json())
            }
            if (projectsRes.ok) {
                setProjects(await projectsRes.json())
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const serviceParam = searchParams.get('service')
        if (serviceParam && services.length > 0) {
            const getTitleStr = (t: string | { en: string; fr: string }) => typeof t === 'string' ? t : t.en
            const index = services.findIndex(s => s._id === serviceParam || getTitleStr(s.title).toLowerCase().replace(/\s+/g, '') === serviceParam)
            if (index !== -1) setActiveIndex(index)
        }
    }, [searchParams, services])

    const getServiceTitle = (title: string | { en: string; fr: string }) => typeof title === 'string' ? title : (language === 'fr' ? title.fr : title.en)
    const getServiceDesc = (desc: string | { en: string; fr: string }) => typeof desc === 'string' ? desc : (language === 'fr' ? desc.fr : desc.en)
    
    const openLightbox = (index: number) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
    }
    const closeLightbox = () => setLightboxOpen(false)
    const prevImage = () => setLightboxIndex(prev => prev > 0 ? prev - 1 : (activeService.images?.length || 1) - 1)
    const nextImage = () => setLightboxIndex(prev => prev < (activeService.images?.length || 1) - 1 ? prev + 1 : 0)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-deep-space-blue-600" />
            </div>
        )
    }

    if (services.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-deep-space-blue-600" />
            </div>
        )
    }

    const activeService = services[activeIndex]
    const serviceTitle = getServiceTitle(activeService.title)
    const serviceDesc = getServiceDesc(activeService.description)

    const prevService = () => {
        setActiveIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1))
    }

    const nextService = () => {
        setActiveIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="min-h-screen">
            <section className="relative h-[60vh] flex items-center justify-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
                        alt="Construction"
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
                            {t('services.subtitle')}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">{t('services.title')}</h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">{t('services.description')}</p>
                    </motion.div>
                </div>
            </section>

            {services.length === 0 ? (
                <section className="py-20 text-center">
                    <p className="text-gray-500 text-lg">
                        {language === 'en' ? 'No services available.' : 'Aucun service disponible.'}
                    </p>
                    <Link href="/contact" className="mt-4 inline-block px-6 py-3 bg-deep-space-blue-600 text-white font-bold rounded-full">
                        {t('nav.getQuote')}
                    </Link>
                </section>
            ) : (
                <section className="relative min-h-[70vh] flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeService.images?.[0] || 'default'}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={activeService.images?.[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop'}
                                    alt="Background"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-white/90"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 py-20 relative z-10 w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeService._id}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 50 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
                                        onClick={() => activeService.images?.length && openLightbox(0)}
                                    >
                                        <Image
                                            src={activeService.images?.[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop'}
                                            alt={serviceTitle}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                        {activeService.images?.length > 0 && (
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-6 left-6">
                                            <div className="w-16 h-16 bg-yellow-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                                                <span className="text-deep-space-blue-600 font-bold text-2xl">{serviceTitle.charAt(0)}</span>
                                            </div>
                                        </div>
                                        {activeService.images?.length > 1 && (
                                            <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                                                {activeService.images.length} images
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {activeService.images?.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2 mt-4">
                                        {activeService.images.map((img, i) => (
                                            <div 
                                                key={i} 
                                                className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${lightboxIndex === i ? 'border-deep-space-blue-600' : 'border-transparent hover:border-yellow-green-500'}`}
                                                onClick={() => openLightbox(i)}
                                            >
                                                <Image src={img} alt={`${serviceTitle} ${i + 1}`} fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={prevService}
                                    className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6 text-deep-space-blue-600" />
                                </button>
                                <button
                                    onClick={nextService}
                                    className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6 text-deep-space-blue-600" />
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeService._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                        {serviceTitle}
                                    </h2>
                                    <p className="text-xl text-gray-600 mb-8">
                                        {serviceDesc}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {activeService.features?.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-yellow-green-500 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {activeService.projectIds && activeService.projectIds.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                                {language === 'en' ? 'Related Projects' : 'Projets Associés'}
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {projects.filter(p => activeService.projectIds?.includes(p._id)).map((project) => {
                                                    const projectTitle = typeof project.title === 'string' ? project.title : project.title.en
                                                    return (
                                                        <Link key={project._id} href={`/portfolio/${project._id}`} className="group block bg-deep-space-blue-50 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                                                            <div className="relative h-24">
                                                                <Image src={project.mainImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=200&fit=crop'} alt={projectTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                                            </div>
                                                            <div className="p-3">
                                                                <h4 className="font-bold text-gray-900 text-sm">{projectTitle}</h4>
                                                                <p className="text-xs text-gray-500">{project.location}</p>
                                                            </div>
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-deep-space-blue-600 text-white font-bold rounded-full hover:bg-deep-space-blue-700 transition-colors"
                                    >
                                        {t('nav.getQuote')} <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex justify-center gap-3 mt-12">
                            {services.map((service, index) => (
                                <button
                                    key={service._id}
                                    onClick={() => setActiveIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        activeIndex === index
                                            ? 'bg-deep-space-blue-600 w-8'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={getServiceTitle(service.title)}
                                />
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            {services.map((service, index) => (
                                <button
                                    key={service._id}
                                    onClick={() => setActiveIndex(index)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        activeIndex === index
                                            ? 'bg-deep-space-blue-600 text-white'
                                            : 'bg-white/80 text-gray-700 hover:bg-white'
                                    }`}
                                >
                                    {getServiceTitle(service.title)}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="py-20 bg-deep-space-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                {language === 'en' ? 'Need a Custom Solution?' : 'Besoin d\'une Solution Personnalisée?'}
                            </h2>
                            <p className="text-lg text-white/80 mb-8">
                                {language === 'en'
                                    ? "Don't see what you're looking for? We offer tailored construction solutions for unique project requirements."
                                    : "Vous ne trouvez pas ce que vous cherchez? Nous offrons des solutions de construction sur mesure pour vos besoins uniques."}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/contact"
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-yellow-green-500 text-deep-space-blue-600 font-bold rounded-full hover:bg-yellow-green-400 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                {language === 'en' ? 'Contact Us' : 'Contactez-Nous'}
                            </Link>
                            <a
                                href="mailto:support@medconsarl.com"
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-deep-space-blue-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                {language === 'en' ? 'Email Us' : 'Envoyez un Email'}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {lightboxOpen && activeService.images && (
                <ImageLightbox
                    images={activeService.images}
                    currentIndex={lightboxIndex}
                    alt={serviceTitle}
                    onClose={closeLightbox}
                    onPrev={prevImage}
                    onNext={nextImage}
                />
            )}
        </div>
    )
}

export default function ServicesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-deep-space-blue-600 border-t-transparent"></div></div>}>
            <ServicesContent />
        </Suspense>
    )
}