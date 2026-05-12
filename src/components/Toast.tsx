'use client'

import { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface ToastProps {
    message: string
    type?: 'success' | 'error' | 'info'
    onClose: () => void
    duration?: number
}

export default function Toast({ message, type = 'success', onClose, duration = 5000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
    }, [onClose, duration])

    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-deep-space-blue-600'
    const Icon = CheckCircle

    return (
        <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
            <div className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm`}>
                <Icon className="w-6 h-6 flex-shrink-0" />
                <p className="text-sm font-medium">{message}</p>
                <button onClick={onClose} className="ml-2 hover:bg-white/20 p-1 rounded-full">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}