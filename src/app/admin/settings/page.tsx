'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
import logo from '@/assets/MEDConSARL_logo.png'

export default function SettingsPage() {
    const router = useRouter()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const passwordRequirements = [
        { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
        { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
        { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter' },
        { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
        { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special character' },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' })
            return
        }

        const failedReq = passwordRequirements.find(req => !req.test(newPassword))
        if (failedReq) {
            setMessage({ type: 'error', text: failedReq.label })
            return
        }

        setLoading(true)
        setMessage(null)

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            })

            const data = await res.json()

            if (res.ok) {
                setMessage({ type: 'success', text: 'Password updated successfully!' })
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update password' })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong' })
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-center mb-8">
                        <Image src={logo} alt="MEDCon SARL" width={140} height={56} className="mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                            <div className="w-12 h-12 bg-deep-space-blue-100 rounded-xl flex items-center justify-center">
                                <Lock className="w-6 h-6 text-deep-space-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900">Change Password</h2>
                                <p className="text-sm text-gray-500">Update your admin password</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        className="w-full p-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none"
                                        placeholder="Enter current password"
                                    />
                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full p-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none"
                                        placeholder="Enter new password"
                                    />
                                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Password Requirements</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {passwordRequirements.map((req, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                            {req.test(newPassword) ? (
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                                            )}
                                            <span className={req.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full p-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none"
                                        placeholder="Confirm new password"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {message.text}
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full py-4 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700 transition-colors disabled:opacity-50">
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}