'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Shield, Globe, Heart, Lightbulb, CheckCircle, Users, Building2, Award, Target } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function AboutPage() {
    const { t, language } = useLanguage()

    const aboutDescription = language === 'en' 
        ? 'MEDCon SARL was created to serve the growing need for quality construction services across Cameroon. What started as a dedicated construction company has evolved into a comprehensive solutions provider serving clients nationwide.'
        : 'MEDCon SARL a été créée pour répondre au besoin croissant de services de construction de qualité au Cameroun.'

    const values = [
        { icon: Shield, title: t('about.value1Title'), desc: t('about.value1Desc') },
        { icon: Globe, title: t('about.value2Title'), desc: t('about.value2Desc') },
        { icon: Heart, title: t('about.value3Title'), desc: t('about.value3Desc') },
        { icon: Lightbulb, title: t('about.value4Title'), desc: t('about.value4Desc') },
    ]

    const milestones = [
        { year: '2019', title: 'Foundation', desc: 'Started with a vision for quality construction' },
        { year: '2020', title: 'Expansion', desc: 'Expanded services to include renovation' },
        { year: '2022', title: 'Growth', desc: 'Added real estate management' },
        { year: '2024', title: 'Excellence', desc: '50+ projects delivered' },
    ]

    const stats = [
        { icon: Building2, value: '50+', label: 'Projects' },
        { icon: Users, value: '40+', label: 'Clients' },
        { icon: Award, value: '5+', label: 'Years' },
        { icon: Target, value: '100%', label: 'Satisfaction' },
    ]

    return (
        <div className="min-h-screen">
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop"
                        alt="Construction"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>
                </div>

                <div className="absolute inset-0 z-10 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-96 h-96 rounded-full border border-yellow-green-500/10"
                            style={{ top: `${20 + i * 15}%`, left: `${10 + i * 20}%` }}
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 10, repeat: Infinity, delay: i * 2 }}
                        />
                    ))}
                </div>

                <div className="max-w-6xl mx-auto px-4 relative z-20">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-none">
                                {t('about.title').split(' ')[0]}<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-green-400 to-yellow-green-600">
                                    {t('about.title').split(' ').slice(1).join(' ')}
                                </span>
                            </h1>
                            <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                {aboutDescription}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <stat.icon className="w-10 h-10 text-yellow-green-400 mx-auto mb-4" />
                                <div className="text-5xl md:text-6xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-gray-400 uppercase tracking-wide text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-yellow-green-500 font-bold tracking-widest uppercase text-sm">Our Journey</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-8">Building Dreams, One Project at a Time</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                {t('about.description1')}
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                {t('about.description2')}
                            </p>
                            <Link
                                href="/portfolio"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-deep-space-blue-500 text-white font-bold rounded-full hover:bg-deep-space-blue-600 transition-colors"
                            >
                                See Our Work <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative h-[600px] rounded-3xl overflow-hidden"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=1200&fit=crop"
                                    alt="Construction project"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                        <div className="text-yellow-green-400 font-bold text-sm uppercase tracking-wide mb-2">Latest Project</div>
                                        <h3 className="text-2xl font-bold text-white">Modern Residential Villa</h3>
                                        <p className="text-white/70 mt-2">Yaoundé, Cameroon</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50, y: 50 }}
                                whileInView={{ opacity: 1, x: 50, y: 50 }}
                                viewport={{ once: true }}
                                className="absolute -bottom-8 -left-8 w-64 h-64 bg-yellow-green-500 rounded-3xl -z-10"
                            ></motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Milestones</h2>
                        <p className="text-gray-500 text-lg">Every project tells a story of growth</p>
                    </div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={milestone.year}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                    className="relative text-center"
                                >
                                    <div className="relative z-10 w-20 h-20 bg-deep-space-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <span className="text-white font-bold text-lg">{milestone.year}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                                    <p className="text-gray-500">{milestone.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('about.values')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative bg-gray-50 rounded-3xl p-8 hover:bg-deep-space-blue-500 transition-all duration-500"
                            >
                                <div className="w-16 h-16 bg-deep-space-blue-100 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                                    <value.icon className="w-8 h-8 text-deep-space-blue-500 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors">{value.title}</h3>
                                <p className="text-gray-500 group-hover:text-white/80 transition-colors">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-yellow-green-400 font-bold tracking-widest uppercase text-sm">Our Mission & Vision</span>
                            <h2 className="text-4xl font-bold mt-4 mb-8">What Drives Us Forward</h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-deep-space-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{t('about.mission')}</h3>
                                        <p className="text-gray-400">{t('about.missionText')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-yellow-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Lightbulb className="w-6 h-6 text-gray-900" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{t('about.vision')}</h3>
                                        <p className="text-gray-400">{t('about.visionText')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-deep-space-blue-500 to-deep-space-blue-700 rounded-3xl p-10 border border-white/10"
                        >
                            <h3 className="text-2xl font-bold mb-6">Ready to Build Together?</h3>
                            <p className="text-white/70 mb-8">
                                Let&apos;s discuss your project and see how we can bring your vision to life with quality craftsmanship and professional service.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-green-500 text-gray-900 font-bold rounded-full hover:bg-yellow-green-400 transition-colors"
                            >
                                Get a Free Quote <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}
