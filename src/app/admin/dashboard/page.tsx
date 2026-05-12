'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, FolderOpen, Briefcase, MessageSquare, Star } from 'lucide-react'

const stats = { portfolio: 8, services: 5, testimonials: 12, messages: 3, pendingTestimonials: 2 }

export default function AdminDashboard() {
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
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-deep-space-blue-100 rounded-full flex items-center justify-center text-deep-space-blue-600 font-bold">J</div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-gray-900">Jean Kamga</h4>
                                    <span className="text-xs text-gray-500">2h ago</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Interested in residential construction project...</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-yellow-green-100 rounded-full flex items-center justify-center text-yellow-green-600 font-bold">M</div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-gray-900">Marie Nguema</h4>
                                    <span className="text-xs text-gray-500">5h ago</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Need quote for office renovation...</p>
                            </div>
                        </div>
                    </div>
                    <Link href="/admin/contacts" className="block mt-4 text-center text-deep-space-blue-600 font-bold hover:underline">View All Messages</Link>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Testimonials</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-yellow-green-50 rounded-xl">
                            <div className="w-10 h-10 bg-deep-space-blue-100 rounded-full flex items-center justify-center text-deep-space-blue-600 font-bold">S</div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-gray-900">Steven Harris</h4>
                                    <div className="flex gap-0.5">
                                        <Star className="w-3 h-3 text-yellow-green-500 fill-yellow-green-500" />
                                        <Star className="w-3 h-3 text-yellow-green-500 fill-yellow-green-500" />
                                        <Star className="w-3 h-3 text-yellow-green-500 fill-yellow-green-500" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Good quality but shipping was slow...</p>
                                <div className="flex gap-2 mt-3">
                                    <button className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">Approve</button>
                                    <button className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">Reject</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link href="/admin/testimonials" className="block mt-4 text-center text-deep-space-blue-600 font-bold hover:underline">Manage All Testimonials</Link>
                </div>
            </div>
        </div>
    )
}