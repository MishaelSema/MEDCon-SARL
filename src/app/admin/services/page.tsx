'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, X, GripVertical, Eye, EyeOff, ImagePlus, ImageMinus, Loader2, Database } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import { useLanguage } from '@/context/LanguageContext'

interface Service {
    _id?: string
    title: string | { en: string; fr: string }
    description: string | { en: string; fr: string }
    features: string[]
    images: string[]
    showOnHome: boolean
    order: number
}

export default function ServicesPage() {
    const { language } = useLanguage()
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [saving, setSaving] = useState(false)
    const [seeding, setSeeding] = useState(false)
    const [formData, setFormData] = useState<Service>({
        title: '',
        description: '',
        features: [],
        images: [],
        showOnHome: true,
        order: 1,
    })
    const [newFeature, setNewFeature] = useState('')

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/admin/services')
            if (res.ok) {
                const data = await res.json()
                setServices(data)
            }
        } catch (error) {
            console.error('Error fetching services:', error)
        } finally {
            setLoading(false)
        }
    }

    const seedDefaultServices = async () => {
        if (!confirm('This will replace existing services with 5 default services. Continue?')) return
        setSeeding(true)
        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch('/api/admin/seed/services', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                await fetchServices()
                alert('5 default services added!')
            }
        } catch (error) {
            console.error('Error seeding services:', error)
        } finally {
            setSeeding(false)
        }
    }

    const getTitle = (title: string | { en: string; fr: string }) => {
        return typeof title === 'string' ? title : (language === 'fr' ? title.fr : title.en)
    }

    const getDescription = (desc: string | { en: string; fr: string }) => {
        return typeof desc === 'string' ? desc : (language === 'fr' ? desc.fr : desc.en)
    }

    const handleOpenModal = (service: Service | null = null) => {
        if (service) {
            setFormData({
                _id: service._id,
                title: typeof service.title === 'string' ? service.title : '',
                description: typeof service.description === 'string' ? service.description : '',
                features: service.features || [],
                images: service.images || [],
                showOnHome: service.showOnHome ?? true,
                order: service.order || 1,
            })
        } else {
            setFormData({
                title: '',
                description: '',
                features: [],
                images: [],
                showOnHome: true,
                order: services.length + 1,
            })
        }
        setEditingService(service)
        setShowModal(true)
    }

    const addFeature = () => {
        if (newFeature.trim()) {
            setFormData({ ...formData, features: [...formData.features, newFeature.trim()] })
            setNewFeature('')
        }
    }

    const removeFeature = (index: number) => {
        setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
    }

    const addImage = () => {
        setFormData({ ...formData, images: [...formData.images, ''] })
    }

    const removeImage = (index: number) => {
        setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })
    }

    const updateImage = (index: number, url: string) => {
        const newImages = [...formData.images]
        newImages[index] = url
        setFormData({ ...formData, images: newImages })
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch('/api/admin/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                await fetchServices()
                setShowModal(false)
                setEditingService(null)
            } else {
                alert('Failed to save service')
            }
        } catch (error) {
            console.error('Error saving service:', error)
            alert('Error saving service')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return
        
        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch(`/api/admin/services?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (res.ok) {
                await fetchServices()
            } else {
                alert('Failed to delete service')
            }
        } catch (error) {
            console.error('Error deleting service:', error)
        }
    }

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
                <h1 className="text-2xl font-bold text-gray-900">Services Management ({services.length})</h1>
                <div className="flex gap-3">
                    {services.length === 0 && (
                        <button onClick={seedDefaultServices} disabled={seeding} className="flex items-center gap-2 px-4 py-2 bg-yellow-green-500 text-deep-space-blue-900 font-bold rounded-xl hover:bg-yellow-green-400 disabled:opacity-50">
                            <Database className="w-4 h-4" /> {seeding ? 'Seeding...' : 'Seed Default Services'}
                        </button>
                    )}
                    <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700">
                        <Plus className="w-4 h-4" /> Add Service
                    </button>
                </div>
            </div>

            {services.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center">
                    <p className="text-gray-500 mb-4">No services yet. Add your first service or seed defaults.</p>
                    <button onClick={seedDefaultServices} disabled={seeding} className="px-6 py-3 bg-yellow-green-500 text-deep-space-blue-900 font-bold rounded-xl hover:bg-yellow-green-400 disabled:opacity-50">
                        <Database className="w-4 h-4 inline mr-2" /> {seeding ? 'Seeding...' : 'Seed 5 Default Services'}
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Order</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Service</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Features</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Images</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Show on Home</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {services.sort((a, b) => a.order - b.order).map((service) => (
                                    <tr key={service._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                                                <span className="font-bold text-gray-900">{service.order}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 bg-deep-space-blue-50 rounded-xl overflow-hidden flex items-center justify-center">
                                                    {service.images?.[0] ? (
                                                        <Image src={service.images[0]} alt={getTitle(service.title)} fill className="object-cover" />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No img</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{getTitle(service.title)}</h3>
                                                    <p className="text-sm text-gray-500 max-w-xs truncate">{getDescription(service.description)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {service.features?.slice(0, 2).map((f, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-deep-space-blue-50 text-deep-space-blue-700 text-xs rounded-full">{f}</span>
                                                ))}
                                                {service.features?.length > 2 && <span className="text-xs text-gray-400">+{service.features.length - 2} more</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">{service.images?.length || 0} image(s)</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {service.showOnHome ? (
                                                <span className="flex items-center gap-1 text-green-600"><Eye className="w-4 h-4" /> Visible</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-gray-400"><EyeOff className="w-4 h-4" /> Hidden</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(service)} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => service._id && handleDelete(service._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                            <button onClick={() => { setShowModal(false); setEditingService(null) }} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Service Name</label>
                                <input type="text" value={formData.title as string} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" placeholder="e.g., Construction" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea rows={3} value={formData.description as string} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none resize-none"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Features</label>
                                <div className="flex gap-2 mb-2">
                                    <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} className="flex-1 p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" placeholder="Add a feature..." />
                                    <button type="button" onClick={addFeature} className="px-4 py-3 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700"><Plus className="w-4 h-4" /></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.features.map((feature, index) => (
                                        <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-deep-space-blue-50 text-deep-space-blue-700 rounded-full text-sm">
                                            {feature}
                                            <button type="button" onClick={() => removeFeature(index)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Display Order</label>
                                <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.showOnHome} onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })} className="w-5 h-5 rounded" />
                                    <span className="font-medium text-gray-700">Show on Homepage</span>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Images</label>
                                <div className="space-y-3">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="flex gap-2 items-start">
                                            <div className="flex-1">
                                                <ImageUpload
                                                    value={image}
                                                    onChange={(url) => updateImage(index, url)}
                                                    onRemove={() => removeImage(index)}
                                                    folder="medcon-sarl/services"
                                                />
                                            </div>
                                            <button type="button" onClick={() => removeImage(index)} className="px-3 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 mt-12"><ImageMinus className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addImage} className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-deep-space-blue-500 hover:text-deep-space-blue-600">
                                        <ImagePlus className="w-4 h-4" /> Add Image
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Upload multiple images. First image will be the main image.</p>
                            </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3">
                            <button onClick={() => { setShowModal(false); setEditingService(null) }} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700 disabled:opacity-50">
                                {saving ? 'Saving...' : (editingService ? 'Save Changes' : 'Add Service')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}