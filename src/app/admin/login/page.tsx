'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (res.ok) {
                const data = await res.json()
                localStorage.setItem('admin-token', data.token)
                localStorage.setItem('admin-login-time', Date.now().toString())
                router.push('/admin/dashboard')
            } else {
                setError('Invalid credentials')
            }
        } catch (err) {
            setError('Something went wrong')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-deep-space-blue-950 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-yellow-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-deep-space-blue-900 font-bold text-2xl">M</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">MEDCon Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">Sign in to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" placeholder="admin@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none pr-12" placeholder="Enter your password" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">{error}</div>}

                    <button type="submit" disabled={loading} className="w-full py-4 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700 transition-colors disabled:opacity-50">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Default: admin@medcon.com / admin123</p>
                </div>
            </motion.div>
        </div>
    )
}