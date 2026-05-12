'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface LightboxProps {
    images: string[]
    currentIndex: number
    alt: string
    onClose: () => void
    onPrev: () => void
    onNext: () => void
}

export default function ImageLightbox({ images, currentIndex, alt, onClose, onPrev, onNext }: LightboxProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') onPrev()
            if (e.key === 'ArrowRight') onNext()
        }
        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [onClose, onPrev, onNext])

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
            <button onClick={onClose} className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10">
                <X className="w-6 h-6 text-white" />
            </button>
            
            <button onClick={onPrev} disabled={images.length <= 1} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30">
                <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            
            <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center p-8">
                <Image
                    src={images[currentIndex]}
                    alt={`${alt} ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            
            <button onClick={onNext} disabled={images.length <= 1} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30">
                <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {}}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                        />
                    ))}
                    <span className="text-white/70 text-sm ml-2">{currentIndex + 1} / {images.length}</span>
                </div>
            )}
        </div>
    )
}

export function useLightbox() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const openLightbox = (index: number) => {
        setCurrentIndex(index)
        setIsOpen(true)
    }

    const closeLightbox = () => setIsOpen(false)

    const prevImage = () => setCurrentIndex(prev => prev > 0 ? prev - 1 : prev)
    const nextImage = () => setCurrentIndex(prev => prev)

    return { isOpen, currentIndex, openLightbox, closeLightbox, prevImage, nextImage }
}