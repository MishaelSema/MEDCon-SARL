'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import logo from '@/assets/MEDConSARL_logo.png'

export default function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const { language, setLanguage, t } = useLanguage()

    const isHomePage = pathname === '/'
    const isScrolledOrNonHome = !isHomePage
        { name: 'home', href: '/' },
        { name: 'about', href: '/about' },
        { name: 'services', href: '/services' },
        { name: 'portfolio', href: '/portfolio' },
        { name: 'contact', href: '/contact' },
    ]

    const getNavClasses = () => {
        if (mobileMenuOpen) return 'bg-deep-space-blue-800 text-white'
        
        if (isScrolledOrNonHome) {
            return 'bg-white text-gray-900 shadow-lg'
        }
        
        return 'bg-transparent text-white'
    }

    const getLinkClasses = (href: string) => {
        const isActive = pathname === href
        const baseClasses = 'px-5 py-2 font-medium transition-all duration-300 rounded-full'
        
        if (isScrolledOrNonHome) {
            return `${baseClasses} ${isActive ? 'bg-deep-space-blue-600 text-white' : 'hover:bg-deep-space-blue-50 text-gray-700'}`
        }
        
        return `${baseClasses} ${isActive ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white'}`
    }

    const getQuoteClasses = () => {
        const baseClasses = 'flex items-center gap-2 px-5 py-2.5 font-bold transition-all duration-300 rounded-full'
        
        if (isScrolledOrNonHome) {
            return `${baseClasses} bg-yellow-green-500 text-deep-space-blue-900 hover:bg-yellow-green-400`
        }
        
        return `${baseClasses} bg-yellow-green-500 text-deep-space-blue-900 hover:bg-yellow-green-400`
    }

    const getLangButtonClasses = () => {
        const baseClasses = 'flex items-center gap-2 px-3 py-2 font-medium transition-all duration-300 rounded-full'
        
        if (isScrolledOrNonHome) {
            return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`
        }
        
        return `${baseClasses} bg-white/20 text-white hover:bg-white/30`
    }

    if (pathname?.startsWith('/admin')) return null

    return (
        <>
            <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${getNavClasses()} ${isScrolledOrNonHome ? 'w-[calc(100%-2rem)] max-w-5xl' : 'w-[calc(100%-4rem)] max-w-6xl'}`} style={{ borderRadius: '9999px' }}>
                <div className="max-w-7xl mx-auto px-2 py-2">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="pl-2">
                            <Image src={logo} alt="MEDCon SARL" width={140} height={56} className="h-14 w-auto" />
                        </Link>

                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={getLinkClasses(link.href)}
                                >
                                    {t(`nav.${link.name}`)}
                                </Link>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-3 pr-2">
                            <Link href="/contact" className={getQuoteClasses()}>
                                {t('nav.getQuote')}
                            </Link>

                            <button
                                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                                className={getLangButtonClasses()}
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-sm uppercase font-bold">{language}</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2 lg:hidden pr-2">
                            <button
                                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                                className={`p-2 transition-all ${isScrolledOrNonHome ? 'bg-gray-100 rounded-full' : 'bg-white/20 rounded-full'}`}
                            >
                                <Globe className={`w-5 h-5 ${isScrolledOrNonHome ? 'text-gray-700' : 'text-white'}`} />
                            </button>
                            <button
                                className="p-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <X className={`w-6 h-6 ${isScrolledOrNonHome ? 'text-gray-900' : 'text-white'}`} />
                                ) : (
                                    <Menu className={`w-6 h-6 ${isScrolledOrNonHome ? 'text-gray-900' : 'text-white'}`} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-deep-space-blue-800 pt-24 px-6 lg:hidden"
                        style={{ borderRadius: 0 }}
                    >
                        <div className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-xl font-bold text-white py-4 border-b border-white/20"
                                >
                                    {t(`nav.${link.name}`)}
                                </Link>
                            ))}
                            <Link
                                href="/contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-6 px-6 py-4 bg-yellow-green-500 text-deep-space-blue-900 rounded-full font-bold text-center"
                            >
                                {t('nav.getQuote')}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}