'use client'

import { useState, useEffect } from 'react'
import { Check, X, Star, Loader2, Plus, Pencil, Trash2, X as XIcon } from 'lucide-react'

interface Testimonial {
    _id: string
    name: string
    email: string
    rating: number
    content: string
    text?: string
    status: string
    createdAt: string
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
    const [formData, setFormData] = useState({ name: '', email: '', rating: 5, text: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        try {
            const token = localStorage.getItem('admin-token')
            const res = await fetch('/api/testimonials', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setTestimonials(data)
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('admin-token')
            const res = await fetch('/api/admin/testimonials', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ _id: id, status }),
            })

            if (res.ok) {
                setTestimonials(testimonials.map(t => t._id === id ? { ...t, status } : t))
            }
        } catch (error) {
            console.error('Error updating testimonial:', error)
        }
    }

    const deleteTestimonial = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return
        
        try {
            const token = localStorage.getItem('admin-token')
            const res = await fetch(`/api/admin/testimonials?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (res.ok) {
                setTestimonials(testimonials.filter(t => t._id !== id))
            }
        } catch (error) {
            console.error('Error deleting testimonial:', error)
        }
    }

    const handleOpenModal = (testimonial: Testimonial | null = null) => {
        if (testimonial) {
            setFormData({ name: testimonial.name, email: testimonial.email, rating: testimonial.rating, text: testimonial.content || testimonial.text || '' })
        } else {
            setFormData({ name: '', email: '', rating: 5, text: '' })
        }
        setEditingTestimonial(testimonial)
        setShowModal(true)
    }

    const handleSave = async () => {
        if (!formData.name || !formData.email || !formData.text) return
        
        setSaving(true)
        try {
            const token = localStorage.getItem('admin-token')
            const res = await fetch('/api/admin/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...formData, status: 'approved' })
            })
            
            if (res.ok) {
                await fetchTestimonials()
                setShowModal(false)
                setEditingTestimonial(null)
            }
        } catch (error) {
            console.error('Error saving testimonial:', error)
        } finally {
            setSaving(false)
        }
    }

    const renderStars = (rating: number) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-green-500 fill-yellow-green-500' : 'text-gray-300'}`} />
            ))}
        </div>
    )

    const pending = testimonials.filter(t => t.status === 'pending')
    const approved = testimonials.filter(t => t.status === 'approved')

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-deep-space-blue-600" />
            </div>
        )
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
                    <span className="px-3 py-1 bg-yellow-green-100 text-yellow-green-700 text-sm font-bold rounded-full">{pending.length} Pending</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">{approved.length} Approved</span>
                </div>
                <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 px-4 py-2 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700">
                    <Plus className="w-4 h-4" /> Add Testimonial
                </button>
            </div>

            {pending.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Approvals</h2>
                    <div className="space-y-4">
                        {pending.map((t) => (
                            <div key={t._id} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-green-400">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-deep-space-blue-100 rounded-full flex items-center justify-center text-deep-space-blue-600 font-bold text-lg">{t.name.charAt(0)}</div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-gray-900">{t.name}</h3>
                                                {renderStars(t.rating)}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{t.email}</p>
                                            <p className="text-gray-700 mt-3 leading-relaxed border-l-4 border-yellow-green-400 pl-4 italic">"{t.content || t.text}"</p>
                                            <p className="text-xs text-gray-400 mt-3">Submitted: {new Date(t.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => updateStatus(t._id, 'approved')} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600">
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                        <button onClick={() => updateStatus(t._id, 'rejected')} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600">
                                            <X className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">All Testimonials</h2>
                {testimonials.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <p className="text-gray-500">No testimonials yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testimonials.map((t) => (
                            <div key={t._id} className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${t.status === 'approved' ? 'border-green-500' : t.status === 'pending' ? 'border-yellow-green-400' : 'border-red-500'}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-deep-space-blue-100 rounded-full flex items-center justify-center text-deep-space-blue-600 font-bold">{t.name.charAt(0)}</div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{t.name}</h3>
                                            <p className="text-xs text-gray-500">{t.email}</p>
                                        </div>
                                    </div>
                                    {renderStars(t.rating)}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-3 mb-3">"{t.content || t.text}"</p>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        {t.status === 'approved' ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Approved</span>
                                        ) : t.status === 'pending' ? (
                                            <span className="px-2 py-1 bg-yellow-green-100 text-yellow-green-700 text-xs font-medium rounded-full">Pending</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Rejected</span>
                                        )}
                                        <span className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {t.status !== 'approved' && (
                                            <button onClick={() => updateStatus(t._id, 'approved')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Check className="w-4 h-4" /></button>
                                        )}
                                        {t.status !== 'rejected' && (
                                            <button onClick={() => updateStatus(t._id, 'rejected')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><X className="w-4 h-4" /></button>
                                        )}
                                    </div>
                                </div>
</div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><XIcon className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Client Name</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="p-1">
                                            <Star className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-green-500 fill-yellow-green-500' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Testimonial Text</label>
                                <textarea value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} rows={4} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none resize-none" placeholder="What the client said..."></textarea>
                            </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                            <button onClick={handleSave} disabled={saving || !formData.name || !formData.email || !formData.text} className="px-6 py-3 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700 disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Testimonial'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}