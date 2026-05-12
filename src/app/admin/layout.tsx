'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ pendingTestimonials: 2, messages: 3 })

    useEffect(() => {
        if (pathname === '/admin/login') {
            setLoading(false)
            return
        }

        const token = localStorage.getItem('admin-token')
        if (!token) {
            router.push('/admin/login')
            return
        }

        const loginTime = localStorage.getItem('admin-login-time')
        if (loginTime) {
            const elapsed = Date.now() - parseInt(loginTime)
            const thirtyDays = 30 * 24 * 60 * 60 * 1000
            if (elapsed > thirtyDays) {
                localStorage.removeItem('admin-token')
                localStorage.removeItem('admin-login-time')
                router.push('/admin/login')
                return
            }
        }

        setLoading(false)
    }, [pathname, router])

    if (loading || pathname === '/admin/login') {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <AdminSidebar stats={stats} />
            <div className="flex-1 lg:ml-0">
                <main className="pt-16 lg:pt-0 p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}