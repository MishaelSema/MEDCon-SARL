'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, FolderOpen, Briefcase, MessageSquare, Star } from 'lucide-react'

export default function AdminDashboard() {
    const [stats, setStats] = useState({ portfolio: 0, services: 0, testimonials: 0, messages: 0, pendingTestimonials: 0 })
    const [recentMessages, setRecentMessages] = useState<any[]>([])
    const [pendingTestimonials, setPendingTestimonials] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('admin-token')
            if (!token) return

            try {
                const [projectsRes, servicesRes, testimonialsRes, contactsRes] = await Promise.all([
                    fetch('/api/admin/projects'),
                    fetch('/api/admin/services'),
                    fetch('/api/testimonials'),
                    fetch('/api/contact', { headers: { Authorization: `Bearer ${token}` } })
                ])

                const projects = await projectsRes.json()
                const services = await servicesRes.json()
                const testimonials = await testimonialsRes.json()
                const contacts = contactsRes.ok ? await contactsRes.json() : []

                const pending = testimonials.filter((t: any) => t.status === 'pending')

                setStats({
                    portfolio: Array.isArray(projects) ? projects.length : 0,
                    services: Array.isArray(services) ? services.length : 0,
                    testimonials: testimonials.length,
                    messages: contacts.length,
                    pendingTestimonials: pending.length
                })

                setRecentMessages(contacts.slice(0, 3))
                setPendingTestimonials(pending.slice(0, 3))
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            }
        }

        fetchData()
    }, [])

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
        if (diff < 60) return `${diff}s ago`
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        return `${Math.floor(diff / 86400)}d ago`
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Portfolio Projects</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.portfolio}</p>
                        </div>
                        <div className="w-12 h-12 bg-deep-space-blue-100 rounded-xl flex items-center justify-center">
                            <FolderOpen className="w-6 h-6 text-deep-space-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Services</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.services}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-green-100 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-yellow-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Testimonials</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.testimonials}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Star className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Messages</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.messages}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Messages</h3>
                    <div className="space-y-4">
                        {recentMessages.length > 0 ? recentMessages.map((msg: any) => (
                            <div key={msg._id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-deep-space-blue-100 rounded-full flex items-center justify-center text-deep-space-blue-600 font-bold">{msg.name.charAt(0)}</div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-gray-900">{msg.name}</h4>
                                        <span className="text-xs text-gray-500">{formatTimeAgo(msg.createdAt)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{msg.message?.slice(0, 60)}...</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4">No messages yet</p>
                        )}
                    </div>
                    <Link href="/admin/contacts" className="block mt-4 text-center text-deep-space-blue-600 font-bold hover:underline">View All Messages</Link>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Testimonials</h3>
                    <div className="space-y-4">
                        {pendingTestimonials.length > 0 ? pendingTestimonials.map((t: any) => (
                            <div key={t._id} className="flex items-start gap-4 p-4 bg-yellow-green-50 rounded-xl">
                                <div className="w-10 h-10 bg-deep-space-blue-100 rounded-full flex items-center justify-center text-deep-space-blue-600 font-bold">{t.name.charAt(0)}</div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                                        <div className="flex gap-0.5">
                                            {[...Array(t.rating || 5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 text-yellow-green-500 fill-yellow-green-500" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{t.content?.slice(0, 60)}...</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4">No pending testimonials</p>
                        )}
                    </div>
                    <Link href="/admin/testimonials" className="block mt-4 text-center text-deep-space-blue-600 font-bold hover:underline">Manage All Testimonials</Link>
                </div>
            </div>
        </div>
    )
}