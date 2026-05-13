'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function WelcomePopup() {
    const [isOpen, setIsOpen] = useState(false)
    const { language } = useLanguage()

    useEffect(() => {
        const dismissed = localStorage.getItem('med-welcome-dismissed')
        if (dismissed) return
        
        const timer = setTimeout(() => setIsOpen(true), 30000)
        return () => clearTimeout(timer)
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem('med-welcome-dismissed', 'true')
    }

    const message = language === 'fr' 
        ? "Bienvenue ! Nous avons plus de 5 ans d'expérience dans la construction au Cameroun. Nous serions ravis de discuter de votre projet."
        : "Welcome! We have over 5 years of experience in construction across Cameroon. We'd love to hear about your project."

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-24 right-6 z-50 w-full max-w-sm"
            >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 bg-deep-space-blue-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-yellow-green-500 flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-deep-space-blue-900" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">MEDCon SARL</h4>
                                    <span className="text-xs text-yellow-green-400">Online</span>
                                </div>
                            </div>
                            <button 
                                onClick={handleClose}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white/70" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-4">
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            {message}
                        </p>
                        <div className="flex gap-2">
                            <a 
                                href="/contact"
                                className="flex-1 py-2 px-3 bg-deep-space-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-deep-space-blue-700 transition-colors text-center"
                            >
                                {language === 'fr' ? 'Demander un devis' : 'Get a Quote'}
                            </a>
                            <a 
                                href="https://wa.me/237671911489?text=Hello!%20I%27d%20like%20to%20inquire%20about%20your%20construction%20services."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2 px-3 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}