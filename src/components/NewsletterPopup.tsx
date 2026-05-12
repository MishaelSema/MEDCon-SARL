'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { X, Download, Check } from 'lucide-react'

export default function NewsletterPopup() {
    const { t } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem('med-popup-seen')
        if (!hasSeenPopup) {
            const timer = setTimeout(() => setIsOpen(true), 3000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        sessionStorage.setItem('med-popup-seen', 'true')
    }

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (email && name) {
            setSubscribed(true)
            sessionStorage.setItem('med-popup-seen', 'true')
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <div className="relative h-40 bg-gradient-to-br from-deep-space-blue-500 to-deep-space-blue-700">
                        <Image
                            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=300&fit=crop"
                            alt="Construction"
                            fill
                            className="object-cover opacity-30"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-green-500 rounded-full text-gray-900 font-bold text-sm mb-3">
                                    <Download className="w-4 h-4" />
                                    {t('popup.titleAccent')}
                                </div>
                                <h3 className="text-2xl font-bold text-white px-6">{t('popup.title')}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {subscribed ? (
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                                <p className="text-gray-600">Check your email for your free construction guide.</p>
                            </motion.div>
                        ) : (
                            <>
                                <p className="text-gray-600 mb-6">{t('popup.description')}</p>
                                
                                <ul className="space-y-3 mb-8">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-yellow-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-4 h-4 text-yellow-green-600" />
                                            </div>
                                            <span className="text-gray-600 text-sm">{t(`popup.bullet${i}`)}</span>
                                        </li>
                                    ))}
                                </ul>

                                <form onSubmit={handleSubscribe} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder={t('popup.namePlaceholder')}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-deep-space-blue-500 focus:outline-none transition-all"
                                    />
                                    <input
                                        type="email"
                                        placeholder={t('popup.emailPlaceholder')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-deep-space-blue-500 focus:outline-none transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-deep-space-blue-500 text-white font-bold rounded-xl hover:bg-deep-space-blue-600 transition-colors"
                                    >
                                        {t('popup.button')}
                                    </button>
                                </form>

                                <p className="text-xs text-gray-400 text-center mt-4">{t('popup.privacy')}</p>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
