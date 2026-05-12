'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { Send, CheckCircle, AlertCircle, Star, ShieldCheck, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useForm } from 'react-hook-form'

type FormData = {
    name: string
    email: string
    phone: string
    service: string
    message: string
    text?: string
    rating?: number
}

type TestimonialFormData = {
    name: string
    email: string
    text: string
}

const reviews = [
    { name: 'Dr. Christopher Lee', role: 'Verified Client', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, text: 'Outstanding service and products. Our project has seen great results with each order delivered exactly as described. Very impressed.' },
    { name: 'Dr. Nancy White', role: 'Verified Client', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, text: "We've recommended MEDCon to several clients. Their reliability and quality make them our go-to construction partner." },
    { name: 'Dr. Stephanie Taylor', role: 'Verified Client', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', rating: 5, text: 'Outstanding quality and service. The team really knows their craft. A pleasure to work with.' },
    { name: 'Brian Clark', role: 'Verified Client', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', rating: 4, text: 'Works well for my needs. The renovation project arrived in great condition. Price is reasonable for the quality.' },
]

export default function ContactPage() {
    const { t } = useLanguage()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
    const { register: registerTestimonial, handleSubmit: handleTestimonialSubmit, reset: resetTestimonial } = useForm<TestimonialFormData>()
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [showTestimonialModal, setShowTestimonialModal] = useState(false)
    const [testimonialRating, setTestimonialRating] = useState(5)

    const onSubmit = async (data: FormData) => {
        setStatus('loading')
        try {
            const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
            if (res.ok) { setStatus('success'); reset() } else { setStatus('error') }
        } catch { setStatus('error') }
    }

    const onTestimonialSubmit = async (data: TestimonialFormData) => {
        try {
            await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, rating: testimonialRating }) })
            setShowTestimonialModal(false); resetTestimonial(); alert('Thank you! Your testimonial has been submitted for review.')
        } catch { alert('Something went wrong. Please try again.') }
    }

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-green-500 fill-yellow-green-500' : 'text-gray-300'}`} />
            ))}
        </div>
    )

    return (
        <div className="min-h-screen">
            <section className="min-h-[calc(100vh-4rem)] flex">
                <div className="w-1/2 relative hidden lg:block">
                    <Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=1600&fit=crop" alt="Construction site" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deep-space-blue-950/50"></div>
                </div>

                <div className="w-full lg:w-1/2 bg-white px-8 md:px-16 py-16 flex flex-col justify-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="text-yellow-green-500 font-bold tracking-widest uppercase text-sm">{t('contact.subtitle')}</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">{t('contact.title')}</h1>
                        <p className="text-xl text-gray-500 mb-12">{t('contact.description')}</p>
                    </motion.div>

                    {status === 'success' ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-deep-space-blue-50 rounded-3xl p-10 text-center border border-deep-space-blue-100">
                            <CheckCircle className="w-16 h-16 text-yellow-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('contact.success')}</h3>
                            <p className="text-gray-600 mb-6">{t('contact.successText')}</p>
                            <button onClick={() => setStatus('idle')} className="text-deep-space-blue-600 font-bold hover:underline">{t('contact.sendAnother')}</button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('contact.name')}</label>
                                    <input {...register('name', { required: true })} type="text" className="w-full p-4 rounded-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-deep-space-blue-500 focus:outline-none transition-all" placeholder={t('contact.namePlaceholder')} />
                                    {errors.name && <span className="text-red-500 text-sm mt-1 block">Name is required</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('contact.email')}</label>
                                    <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} type="email" className="w-full p-4 rounded-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-deep-space-blue-500 focus:outline-none transition-all" placeholder={t('contact.emailPlaceholder')} />
                                    {errors.email && <span className="text-red-500 text-sm mt-1 block">Valid email is required</span>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('contact.phone')}</label>
                                    <input {...register('phone')} type="tel" className="w-full p-4 rounded-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-deep-space-blue-500 focus:outline-none transition-all" placeholder={t('contact.phonePlaceholder')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('contact.service')}</label>
                                    <select {...register('service', { required: true })} className="w-full p-4 rounded-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-deep-space-blue-500 focus:outline-none transition-all">
                                        <option value="">{t('contact.selectService')}</option>
                                        <option value="construction">{t('services.construction.title')}</option>
                                        <option value="renovation">{t('services.renovation.title')}</option>
                                        <option value="interior">{t('services.interior.title')}</option>
                                        <option value="realEstate">{t('services.realEstate.title')}</option>
                                        <option value="generalMerchandise">{t('services.generalMerchandise.title')}</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.service && <span className="text-red-500 text-sm mt-1 block">Please select a service</span>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t('contact.message')}</label>
                                <textarea {...register('message', { required: true })} rows={5} className="w-full p-4 rounded-3xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-deep-space-blue-500 focus:outline-none resize-none transition-all" placeholder={t('contact.messagePlaceholder')}></textarea>
                                {errors.message && <span className="text-red-500 text-sm mt-1 block">Message is required</span>}
                            </div>
                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-full">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{t('contact.errorText')}</span>
                                </div>
                            )}
                            <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-deep-space-blue-600 text-white font-bold rounded-full hover:bg-deep-space-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                {status === 'loading' ? (<><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{t('contact.sending')}</>) : (<>{t('contact.send')} <Send className="w-4 h-4" /></>)}
                            </button>
                            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mt-4">
                                <a href="tel:+237671911489" className="hover:text-deep-space-blue-600">+237 671 911 489</a>
                                <span>|</span>
                                <a href="mailto:medcocoltd@gmail.com" className="hover:text-deep-space-blue-600">medcocoltd@gmail.com</a>
                            </div>
                        </form>
                    )}
                </div>
            </section>

            <section className="py-20 bg-deep-space-blue-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" id="testimonials">
                    <div className="text-center mb-12">
                        <span className="text-yellow-green-500 font-bold tracking-widest uppercase text-sm">{t('testimonials.subtitle')}</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">{t('testimonials.title')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {reviews.map((review, index) => (
                            <motion.div key={review.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-deep-space-blue-50 flex-shrink-0">
                                        <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium"><ShieldCheck className="w-3 h-3" /> Verified</span>
                                        </div>
                                        <p className="text-sm text-gray-500">{review.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mb-4">{renderStars(review.rating)}</div>
                                <p className="text-gray-600 leading-relaxed text-sm border-l-4 border-yellow-green-400 pl-4 italic">"{review.text}"</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <button onClick={() => setShowTestimonialModal(true)} className="inline-flex items-center gap-3 px-10 py-4 bg-deep-space-blue-600 text-white font-bold rounded-full hover:bg-deep-space-blue-700 transition-colors text-lg">
                            Leave a Testimonial <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </button>
                    </div>
                </div>
            </section>

            {showTestimonialModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Leave a Testimonial</h3>
                            <button onClick={() => setShowTestimonialModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleTestimonialSubmit(onTestimonialSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                                <input {...registerTestimonial('name', { required: true })} type="text" className="w-full p-3 rounded-full bg-gray-50 border-2 border-transparent focus:border-deep-space-blue-500 focus:outline-none" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Email</label>
                                <input {...registerTestimonial('email', { required: true })} type="email" className="w-full p-3 rounded-full bg-gray-50 border-2 border-transparent focus:border-deep-space-blue-500 focus:outline-none" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button type="button" key={star} onClick={() => setTestimonialRating(star)} className="p-1"><Star className={`w-6 h-6 ${star <= testimonialRating ? 'text-yellow-green-500 fill-yellow-green-500' : 'text-gray-300'}`} /></button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Review</label>
                                <textarea {...registerTestimonial('text', { required: true })} rows={4} className="w-full p-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-deep-space-blue-500 focus:outline-none resize-none" placeholder="Share your experience..."></textarea>
                            </div>
                            <button type="submit" className="w-full py-3 bg-deep-space-blue-600 text-white font-bold rounded-full hover:bg-deep-space-blue-700">Submit Testimonial</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}