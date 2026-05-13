'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { 
    LayoutDashboard, FolderOpen, Briefcase, MessageSquare, Star, 
    LogOut, Menu, X, Clock, Users, Settings
} from 'lucide-react'
import logo from '@/assets/MEDConSARL_logo.png'

const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/leads', icon: Users, label: 'Leads & Guide' },
    { href: '/admin/portfolio', icon: FolderOpen, label: 'Portfolio' },
    { href: '/admin/services', icon: Briefcase, label: 'Services' },
    { href: '/admin/testimonials', icon: Star, label: 'Testimonials' },
    { href: '/admin/contacts', icon: MessageSquare, label: 'Messages' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

interface AdminSidebarProps {
    stats?: { pendingTestimonials?: number; messages?: number }
}

export default function AdminSidebar({ stats }: AdminSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)

    useEffect(() => {
        const loginTime = localStorage.getItem('admin-login-time')
        if (!loginTime) return

        const expiresIn = 30 * 24 * 60 * 60 * 1000
        
        const updateTimeLeft = () => {
            const elapsed = Date.now() - parseInt(loginTime)
            const remaining = expiresIn - elapsed
            
            if (remaining <= 0) {
                localStorage.removeItem('admin-token')
                localStorage.removeItem('admin-login-time')
                router.push('/admin/login')
                return
            }
            
            const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
            const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
            const seconds = Math.floor((remaining % (60 * 1000)) / 1000)
            setTimeLeft({ days, hours, minutes, seconds })
        }

        updateTimeLeft()
        const interval = setInterval(updateTimeLeft, 1000)
        return () => clearInterval(interval)
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('admin-token')
        localStorage.removeItem('admin-login-time')
        router.push('/admin/login')
    }

    return (
        <>
            <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-deep-space-blue-900 text-white transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <Image src={logo} alt="MEDCon SARL" width={40} height={40} className="h-10 w-auto" />
                        <div>
                            <h2 className="font-bold text-lg text-white">Admin</h2>
                            <p className="text-xs text-gray-400">Dashboard</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-colors ${
                                    pathname === item.href
                                        ? 'bg-deep-space-blue-600 text-white'
                                        : 'hover:bg-deep-space-blue-800 text-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                {item.href === '/admin/testimonials' && (stats?.pendingTestimonials ?? 0) > 0 && (
                                    <span className="bg-yellow-green-500 text-deep-space-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {stats?.pendingTestimonials}
                                    </span>
                                )}
                                {item.href === '/admin/contacts' && (stats?.messages ?? 0) > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {stats?.messages}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-4 border-t border-deep-space-blue-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-deep-space-blue-800 transition-colors w-full text-left text-gray-300"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>

                    <div className="mt-4 p-4 bg-deep-space-blue-800 rounded-xl">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                            <Clock className="w-3 h-3" />
                            {timeLeft ? 'Session expires in' : 'Loading...'}
                        </div>
                        <p className="font-bold text-yellow-green-400 font-mono">
                            {timeLeft ? (
                                timeLeft.days > 0 
                                    ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`
                                    : timeLeft.hours > 0
                                        ? `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
                                        : `${timeLeft.minutes}m ${timeLeft.seconds}s`
                            ) : '--'}
                        </p>
                    </div>
                </div>
            </aside>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                    <Link href="/" target="_blank" className="text-sm text-deep-space-blue-600 hover:underline">
                        View Site
                    </Link>
                </div>
            </header>
        </>
    )
}

export { navItems }