'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Download, Check } from 'lucide-react'

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem('med-popup-seen')
        if (!hasSeenPopup) {
            const timer = setTimeout(() => setIsOpen(true), 5000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        sessionStorage.setItem('med-popup-seen', 'true')
    }

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (email && name) {
            try {
                await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email }),
                })
            } catch (error) {
                console.error('Subscription error:', error)
            }
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
                    className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-gray-100 transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <div className="relative h-32 bg-gradient-to-br from-deep-space-blue-500 to-deep-space-blue-700">
                        <Image
                            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=200&fit=crop"
                            alt="Construction"
                            fill
                            className="object-cover opacity-30"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center px-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-green-500 rounded-full text-gray-900 font-bold text-xs mb-2">
                                    <Download className="w-3 h-3" />
                                    FREE GUIDE
                                </div>
                                <h3 className="text-xl font-bold text-white">Construction Guide</h3>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 md:p-6">
                        {subscribed ? (
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Check className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                                <p className="text-gray-600 text-sm">Check your email for your free construction guide.</p>
                            </motion.div>
                        ) : (
                            <>
                                <p className="text-gray-600 mb-4 text-sm">Get our free construction guide with tips and insights.</p>
                                
                                <form onSubmit={handleSubscribe} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-deep-space-blue-500 focus:outline-none transition-all text-sm"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-deep-space-blue-500 focus:outline-none transition-all text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-deep-space-blue-500 text-white font-bold rounded-lg hover:bg-deep-space-blue-600 transition-colors text-sm"
                                    >
                                        Get Free Guide
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}