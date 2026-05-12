'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
    ArrowRight, Building2, Home, Wrench, DollarSign, Palette,
    MapPin, FileText, Lightbulb, Phone, Star, ShieldCheck, X, CheckCircle,
    Award, Users, Heart, HardHat, Hammer, Package
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useForm } from 'react-hook-form'

interface Project {
    _id: string
    title: string
    mainImage: string
    location: string
}

interface Testimonial {
    _id: string
    name: string
    rating: number
    text: string
}

interface Service {
    _id: string
    title: string | { en: string; fr: string }
    description: string | { en: string; fr: string }
    features: string[]
    images: string[]
    icon?: string
    showOnHome: boolean
    order: number
}

interface GuideSettings {
    title: string
    description: string
    downloadUrl: string
    enabled: boolean
}

const SERVICE_ICONS: Record<string, any> = {
    HardHat: Building2,
    Hammer: Wrench,
    Palette: Palette,
    Building: Home,
    Package: DollarSign,
    default: HardHat,
}

export default function HomePage() {
    const { t, language } = useLanguage()
    const [showTestimonialModal, setShowTestimonialModal] = useState(false)
    const [rating, setRating] = useState(5)
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
    const [homeServices, setHomeServices] = useState<Service[]>([])
    const [reviews, setReviews] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false)
    const [guide, setGuide] = useState<GuideSettings>({
        title: 'Get the Construction Guide for Free',
        description: 'Discover everything you need to know before starting your construction project.',
        downloadUrl: '',
        enabled: true,
    })
    const [guideSubmitted, setGuideSubmitted] = useState(false)
    const { register: registerGuide, handleSubmit: handleGuideSubmit, formState: { errors: guideErrors }, reset: resetGuide } = useForm()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    useEffect(() => {
        const savedGuide = localStorage.getItem('guideSettings')
        if (savedGuide) {
            setGuide(JSON.parse(savedGuide))
        }
        setDataLoaded(true)
        
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [projectsRes, servicesRes, testimonialsRes] = await Promise.all([
                fetch('/api/admin/projects'),
                fetch('/api/admin/services'),
                fetch('/api/testimonials')
            ])
            
            if (projectsRes.ok) {
                const projects = await projectsRes.json()
                setFeaturedProjects(projects.slice(0, 3))
            }
            
            if (servicesRes.ok) {
                const services = await servicesRes.json()
                const homeSvcs = services
                    .filter((s: Service) => s.showOnHome)
                    .sort((a: Service, b: Service) => a.order - b.order)
                    .slice(0, 5)
                setHomeServices(homeSvcs)
            }
            
            if (testimonialsRes.ok) {
                const testimonials = await testimonialsRes.json()
                setReviews(testimonials)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const getServiceTitle = (title: string | { en: string; fr: string }) => {
        return typeof title === 'string' ? title : (language === 'fr' ? title.fr : title.en)
    }

    const getServiceDesc = (desc: string | { en: string; fr: string }) => {
        return typeof desc === 'string' ? desc : (language === 'fr' ? desc.fr : desc.en)
    }

    const getServiceIcon = (iconName?: string) => {
        return iconName && SERVICE_ICONS[iconName] ? SERVICE_ICONS[iconName] : SERVICE_ICONS.default
    }

    const getLocalizedText = (text: string | { en: string; fr: string }) => {
        return typeof text === 'string' ? text : (language === 'fr' ? text.fr : text.en)
    }

    const getProjectGridClass = (index: number, total: number) => {
        if (total === 5) {
            return index < 3 ? 'md:col-span-4' : 'md:col-span-6'
        }
        if (total === 4) return 'md:col-span-6'
        if (total === 3) return 'md:col-span-4'
        if (total === 2) return 'md:col-span-6'
        return 'md:col-span-12'
    }

    const getProjectRowClass = (index: number, total: number) => {
        if (total === 5 && index === 3) return 'md:mt-6'
        return ''
    }

    const getServiceGridClass = (index: number, total: number) => {
        if (total <= 2) return 'md:col-span-6'
        if (total === 3 && index === 0) return 'md:col-span-12'
        if (total === 4 && index < 2) return 'md:col-span-6'
        return 'md:col-span-4'
    }

    const stats = [
        { icon: Building2, value: '50+', label: t('home.projects') },
        { icon: Phone, value: '40+', label: t('home.clients') },
        { icon: FileText, value: '5+', label: t('home.years') },
        { icon: Home, value: '15+', label: t('home.team') },
    ]

    const guideBenefits = [
        language === 'en' ? 'Explore the pros and cons of different construction approaches.' : 'Explorez les avantages et inconvénients des différentes approches de construction.',
        language === 'en' ? 'Reflect on essential questions before you start.' : 'Réfléchissez aux questions essentielles avant de commencer.',
        language === 'en' ? 'Get inspired with stunning design ideas.' : 'Inspirez-vous d\'idées de design époustouflantes.',
        language === 'en' ? 'Learn about budgeting and cost management.' : 'Apprenez-en plus sur le budget et la gestion des coûts.',
    ]

    const knowledgeItems = [
        { name: t('portfolio.title'), icon: FileText, href: '/portfolio' },
        { name: t('about.title'), icon: Lightbulb, href: '/about' },
        { name: t('nav.contact'), icon: Phone, href: '/contact' },
    ]

    const renderStars = (r: number) => (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < r ? 'text-yellow-green-500 fill-yellow-green-500' : 'text-gray-600'}`} />
            ))}
        </div>
    )

    const onGuideSubmit = async (data: any) => {
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            
            if (res.ok) {
                setGuideSubmitted(true)
                resetGuide()
                
                if (guide.downloadUrl) {
                    setTimeout(() => {
                        window.open(guide.downloadUrl, '_blank')
                    }, 1000)
                }
            }
        } catch (err) {
            alert('Something went wrong. Please try again.')
        }
    }

    const onTestimonialSubmit = async (data: any) => {
        try {
            await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, rating }),
            })
            setShowTestimonialModal(false)
            reset()
            setRating(5)
            alert('Thank you! Your testimonial has been submitted for review.')
        } catch (err) {
            alert('Something went wrong. Please try again.')
        }
    }

    return (
        <div className="min-h-screen">
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&h=1080&fit=crop" alt="Hero" fill className="object-cover brightness-75" priority />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <span className="text-yellow-green-400 font-bold tracking-[0.3em] uppercase text-sm mb-6 block">{t('hero.tagline')}</span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
                            {t('hero.title')}<br />
                            <span className="relative inline-block mt-2">
                                <span className="relative z-10 text-gray-900">{t('hero.titleAccent')}</span>
                                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] -z-0 text-yellow-green-500 opacity-80" viewBox="0 0 500 500" preserveAspectRatio="none">
                                    <g transform="matrix(1, 0, 0, 1, 209.8228, 182.775528)">
                                        <path d="M 266.104 36.352 C 307.627 31.725 228.584 24.012 192.565 21.313 C 156.544 18.613 131.032 13.6 206.07 15.529 C 281.112 17.071 273.607 8.973 159.546 1.647 C 44.985 -6.066 -143.12 0.104 -143.12 0.104 C -223.66 -0.281 -189.14 56.018 -195.14 72.599 C -201.15 89.181 -192.65 102.292 -184.64 112.704 C -176.64 122.73 -186.64 125.043 -156.12 133.912 C -125.62 142.781 -64.074 127.743 119.526 125.043 C 294.118 122.344 212.074 111.547 172.054 108.461 C 132.03 105.377 149.542 102.678 216.576 99.978 C 283.613 97.664 207.571 91.88 214.074 85.711 C 221.079 79.54 303.623 79.54 240.589 72.213 C 228.584 70.671 266.605 61.803 236.588 60.26 C 206.572 58.718 216.576 55.247 255.099 54.091 C 293.117 52.933 267.603 45.22 246.092 44.064 C 225.081 43.292 224.582 40.979 266.104 36.352 Z" fill="currentColor" />
                                    </g>
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed">{t('hero.description')}</p>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                            <Link href="/portfolio" className="px-6 sm:px-8 py-3 sm:py-4 bg-deep-space-blue-600 text-white font-bold rounded-full hover:bg-deep-space-blue-700 transition-all flex items-center gap-2">
                                {t('hero.viewProjects')} <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/contact" className="px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/30 bg-black/20 backdrop-blur hover:bg-black/40 transition-all text-white font-semibold">
                                {t('hero.talkExpert')}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {guide.enabled && (
                <section className="py-12 md:py-16 bg-deep-space-blue-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-green-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            <div className="text-white">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">{guide.title}</h2>
                                    <p className="text-base md:text-lg text-white/80 mb-4 md:mb-6">{guide.description}</p>
                                    <ul className="space-y-2 md:space-y-3">
                                        {guideBenefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-green-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm md:text-base text-white/90">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>
                            
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl"
                            >
                                {guideSubmitted ? (
                                    <div className="text-center py-4 md:py-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                                            {language === 'en' ? 'Check Your Email!' : 'Vérifiez Votre Email!'}
                                        </h3>
                                        <p className="text-gray-600 mb-4 text-sm">
                                            {language === 'en' 
                                                ? 'Your guide is on its way!'
                                                : 'Votre guide est en route!'}
                                        </p>
                                        {guide.downloadUrl && (
                                            <a href={guide.downloadUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-deep-space-blue-600 text-white font-bold rounded-full hover:bg-deep-space-blue-700 text-sm">
                                                <FileText className="w-4 h-4" /> 
                                                {language === 'en' ? 'Download' : 'Télécharger'}
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <form onSubmit={handleGuideSubmit(onGuideSubmit)} className="space-y-3 md:space-y-4">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                            {language === 'en' ? 'Get Free Guide Now' : 'Obtenez le Guide Gratuit'}
                                        </h3>
                                        <div>
                                            <input
                                                {...registerGuide('name', { required: true })}
                                                type="text"
                                                placeholder={language === 'en' ? 'Enter your name' : 'Entrez votre nom'}
                                                className="w-full p-3 md:p-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none text-base"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                {...registerGuide('email', { required: true })}
                                                type="email"
                                                placeholder={language === 'en' ? 'Enter your email' : 'Entrez votre email'}
                                                className="w-full p-3 md:p-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none text-base"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-3 md:py-4 bg-yellow-green-500 text-deep-space-blue-900 font-bold rounded-xl hover:bg-yellow-green-400 transition-colors flex items-center justify-center gap-2 text-base"
                                        >
                                            {language === 'en' ? 'Get Free Guide Now' : 'Obtenez le Guide Gratuit'}
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                        <p className="text-xs text-gray-500 text-center">
                                            {language === 'en' 
                                                ? 'We respect your privacy.'
                                                : 'Nous respectons votre vie privée.'}
                                        </p>
                                    </form>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            <section className="py-16 bg-deep-space-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                                <stat.icon className="w-6 h-6 text-deep-space-blue-600 mx-auto mb-2" />
                                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                    <span className="text-yellow-green-500 font-bold tracking-widest uppercase text-xs">{t('home.featuredWorkSubtitle')}</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-3">{t('home.featuredWork')}</h2>
                    <p className="text-base text-gray-500 max-w-2xl mx-auto">{t('home.featuredWorkDesc')}</p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {featuredProjects.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No projects yet.</p>
                            <Link href="/portfolio" className="mt-4 inline-block text-deep-space-blue-600 font-bold hover:underline">View All Projects</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {featuredProjects.map((project, index) => (
                                <motion.div key={project._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`group ${getProjectGridClass(index, featuredProjects.length)} ${getProjectRowClass(index, featuredProjects.length)}`}>
                                    <Link href={`/portfolio/${project._id}`} className="block">
                                        <div className="relative h-[300px] rounded-2xl overflow-hidden mb-4 shadow-lg">
                                            <Image src={project.mainImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop'} alt={String(getLocalizedText(project.title))} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                            <div className="absolute top-3 right-3 bg-yellow-green-500 px-3 py-1 rounded-full font-bold text-xs text-gray-900">Featured</div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <div className="flex items-center gap-1 text-xs font-bold text-yellow-green-400 mb-1 uppercase tracking-wide"><MapPin className="w-3 h-3" /> {project.location}</div>
                                                <h3 className="text-lg font-bold">{String(getLocalizedText(project.title))}</h3>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-10">
                        <Link href="/portfolio" className="inline-flex items-center gap-2 text-deep-space-blue-600 font-bold hover:text-deep-space-blue-700 border-b-2 border-deep-space-blue-600 pb-0.5 text-sm">
                            {t('portfolio.viewAll')} <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <span className="text-yellow-green-500 font-bold tracking-widest uppercase text-xs">{t('services.subtitle')}</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-3">{t('services.title')}</h2>
                        <p className="text-base text-gray-500">{t('services.description')}</p>
                    </div>

                    {homeServices.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No services available.</p>
                            <Link href="/services" className="mt-4 inline-block text-deep-space-blue-600 font-bold hover:underline">View All Services</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {homeServices.map((service, index) => {
                                const ServiceIcon = getServiceIcon(service.icon)
                                const title = getServiceTitle(service.title)
                                const description = getServiceDesc(service.description)
                                
                                return (
                                    <motion.div 
                                        key={service._id} 
                                        initial={{ opacity: 0, y: 20 }} 
                                        whileInView={{ opacity: 1, y: 0 }} 
                                        viewport={{ once: true }} 
                                        transition={{ delay: index * 0.1 }} 
                                        className={`${getServiceGridClass(index, homeServices.length)} group relative bg-white border border-gray-100 rounded-2xl p-6 hover:border-deep-space-blue-300 transition-all min-h-[200px] flex flex-col justify-between overflow-hidden`}
                                    >
                                        <div className="absolute -bottom-8 -right-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                                            <ServiceIcon className="w-40 h-40 text-gray-300" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="w-10 h-10 bg-deep-space-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-deep-space-blue-600 transition-colors">
                                                <ServiceIcon className="w-5 h-5 text-deep-space-blue-600 group-hover:text-white transition-colors" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{description}</p>
                                        </div>
                                        <Link href={`/services?service=${service._id}`} className="relative z-10 mt-4 inline-flex items-center gap-1 text-deep-space-blue-600 font-bold text-sm hover:text-deep-space-blue-700">
                                            {t('services.learnMore')} <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-20 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-yellow-green-500 font-bold tracking-widest uppercase text-xs">How We Work</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">Our Process</h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">From initial consultation to project completion, we ensure a seamless experience.</p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="relative text-center"
                        >
                            <div className="relative z-10 w-20 h-20 bg-deep-space-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <span className="text-3xl font-bold text-white">1</span>
                            </div>
                            <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-deep-space-blue-600 to-yellow-green-500"></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Consultation</h3>
                            <p className="text-gray-500 text-sm">Share your vision and requirements with us for a personalized approach.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative text-center"
                        >
                            <div className="relative z-10 w-20 h-20 bg-deep-space-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <span className="text-3xl font-bold text-white">2</span>
                            </div>
                            <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-yellow-green-500 to-deep-space-blue-600"></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Planning</h3>
                            <p className="text-gray-500 text-sm">We create detailed plans including timeline, budget, and design specifications.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="relative text-center"
                        >
                            <div className="relative z-10 w-20 h-20 bg-yellow-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <span className="text-3xl font-bold text-deep-space-blue-900">3</span>
                            </div>
                            <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-deep-space-blue-600 to-yellow-green-500"></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Execution</h3>
                            <p className="text-gray-500 text-sm">Our expert team brings your project to life with quality craftsmanship.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="relative text-center"
                        >
                            <div className="relative z-10 w-20 h-20 bg-yellow-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <span className="text-3xl font-bold text-deep-space-blue-900">4</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Delivery</h3>
                            <p className="text-gray-500 text-sm">Final inspection and handover with complete documentation and support.</p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-16"
                    >
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-deep-space-blue-600 text-white font-bold rounded-full hover:bg-deep-space-blue-700 transition-colors"
                        >
                            Start Your Project <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-deep-space-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-green-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
                        <div className="max-w-2xl">
                            <span className="text-yellow-green-400 font-bold tracking-widest uppercase text-xs">{t('home.knowledgeHubSubtitle')}</span>
                            <h2 className="text-3xl md:text-5xl font-bold mt-3">{t('home.knowledgeHub')}</h2>
                            <p className="text-gray-400 mt-3 text-sm">{t('home.knowledgeHubDesc')}</p>
                        </div>
                        <Link href="/portfolio" className="px-6 py-3 bg-yellow-green-500 text-gray-900 hidden sm:block rounded-full font-bold text-sm hover:bg-yellow-green-400 transition-colors">
                            {t('portfolio.viewAll')}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2 relative group rounded-2xl overflow-hidden bg-gray-800 min-h-[280px]">
                            <Image src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=800&fit=crop" alt="Our Work" fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="flex items-center gap-2 text-yellow-green-400 font-bold mb-2 uppercase tracking-wider text-xs"><FileText className="w-4 h-4" /> Portfolio</div>
                                <h3 className="text-2xl font-bold mb-3">Explore Our Projects</h3>
                                <p className="text-gray-300 max-w-md mb-4 text-sm hidden sm:block">Browse our collection of completed construction projects across Cameroon.</p>
                                <Link href="/portfolio" className="inline-flex items-center px-5 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg hover:bg-white hover:text-black transition-all w-fit font-bold text-sm">
                                    View Projects <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>

                        <div className="relative group rounded-2xl overflow-hidden bg-gray-800 min-h-[280px]">
                            <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop" alt="Our Process" fill className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="flex items-center gap-2 text-yellow-green-400 font-bold mb-2 uppercase tracking-wider text-xs"><Lightbulb className="w-4 h-4" /> Expertise</div>
                                <h3 className="text-xl font-bold">Learn About Us</h3>
                                <Link href="/about" className="text-gray-300 text-sm mt-2 hover:text-white flex items-center gap-1">
                                    Read More <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        {knowledgeItems.map((item) => (
                            <Link key={item.name} href={item.href} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                <item.icon className="w-4 h-4 text-gray-400" />
                                <span className="font-bold text-xs">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-deep-space-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <span className="text-yellow-green-500 font-bold tracking-widest uppercase text-xs">{t('testimonials.subtitle')}</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">{t('testimonials.title')}</h2>
                    </div>

                    {reviews.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No testimonials yet.</p>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden">
                            <div className="flex gap-6 animate-marquee">
                                {[...reviews, ...reviews].map((review, index) => (
                                    <div key={index} className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 border border-gray-100">
                                        <div className="flex items-center gap-1 mb-3">{renderStars(review.rating)}</div>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 border-l-4 border-yellow-green-400 pl-3 italic">"{review.text}"</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-deep-space-blue-600 flex items-center justify-center text-white font-bold text-xs">{review.name.charAt(0)}</div>
                                            <div>
                                                <div className="flex items-center gap-1">
                                                    <h4 className="font-bold text-gray-900 text-xs">{review.name}</h4>
                                                    <span className="flex items-center gap-0.5 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-medium"><ShieldCheck className="w-2.5 h-2.5" /> Verified</span>
                                                </div>
                                                <p className="text-xs text-gray-500">Client</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-center mt-10">
                        <button onClick={() => setShowTestimonialModal(true)} className="inline-flex items-center gap-2 px-8 py-3 bg-deep-space-blue-600 text-white font-bold rounded-full hover:bg-deep-space-blue-700 transition-colors">
                            Leave a Testimonial <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-r from-deep-space-blue-600 to-deep-space-blue-700">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-green-400 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('home.ctaTitle')}</h2>
                    <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">{t('home.ctaDescription')}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact" className="px-8 py-4 bg-yellow-green-500 text-deep-space-blue-600 rounded-full font-bold text-base hover:bg-yellow-green-400 transition-colors shadow-xl">
                            {t('home.ctaButton')}
                        </Link>
                        <Link href="/portfolio" className="px-8 py-4 bg-white text-deep-space-blue-600 rounded-full font-bold text-base hover:bg-gray-100 transition-colors">
                            {t('home.ctaSecondary')}
                        </Link>
                    </div>
                </div>
            </section>

            {showTestimonialModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900"> Leave a Testimonial</h3>
                            <button onClick={() => setShowTestimonialModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit(onTestimonialSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                                <input {...register('name', { required: true })} type="text" className="w-full p-3 rounded-full bg-gray-50 border-2 border-transparent focus:border-deep-space-blue-500 focus:outline-none" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Email</label>
                                <input {...register('email', { required: true })} type="email" className="w-full p-3 rounded-full bg-gray-50 border-2 border-transparent focus:border-deep-space-blue-500 focus:outline-none" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button type="button" key={star} onClick={() => setRating(star)} className="p-1">
                                            <Star className={`w-6 h-6 ${star <= rating ? 'text-yellow-green-500 fill-yellow-green-500' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Review</label>
                                <textarea {...register('text', { required: true })} rows={4} className="w-full p-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-deep-space-blue-500 focus:outline-none resize-none" placeholder="Share your experience..."></textarea>
                            </div>
                            <button type="submit" className="w-full py-3 bg-deep-space-blue-600 text-white font-bold rounded-full hover:bg-deep-space-blue-700">Submit Testimonial</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}