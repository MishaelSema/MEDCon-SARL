'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, X, ImagePlus, ImageMinus, Loader2 } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'

interface Project {
    _id?: string
    title: string
    scope: string
    location: string
    year: string
    area: string
    description: string
    features: string[]
    images: string[]
    mainImage: string
    status: string
}

export default function PortfolioPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<Project>({
        title: '',
        scope: 'New Construction',
        location: '',
        year: '',
        area: '',
        description: '',
        features: [],
        images: [],
        mainImage: '',
        status: 'active',
    })
    const [newFeature, setNewFeature] = useState('')

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects')
            if (res.ok) {
                const data = await res.json()
                setProjects(data)
            }
        } catch (error) {
            console.error('Error fetching projects:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (project: Project | null = null) => {
        if (project) {
            setFormData({
                _id: project._id,
                title: project.title || '',
                scope: project.scope || 'New Construction',
                location: project.location || '',
                year: project.year || '',
                area: project.area || '',
                description: project.description || '',
                features: project.features || [],
                images: project.images || [],
                mainImage: project.mainImage || '',
                status: project.status || 'active',
            })
        } else {
            setFormData({
                title: '',
                scope: 'New Construction',
                location: '',
                year: '',
                area: '',
                description: '',
                features: [],
                images: [],
                mainImage: '',
                status: 'active',
            })
        }
        setEditingProject(project)
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
            const res = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                await fetchProjects()
                setShowModal(false)
                setEditingProject(null)
            } else {
                alert('Failed to save project')
            }
        } catch (error) {
            console.error('Error saving project:', error)
            alert('Error saving project')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return
        
        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch(`/api/admin/projects?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (res.ok) {
                await fetchProjects()
            } else {
                alert('Failed to delete project')
            }
        } catch (error) {
            console.error('Error deleting project:', error)
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
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Projects ({projects.length})</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700">
                    <Plus className="w-4 h-4" /> Add Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center">
                    <p className="text-gray-500 mb-4">No projects yet. Add your first project to get started.</p>
                    <button onClick={() => handleOpenModal()} className="px-6 py-3 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700">
                        Add First Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                            <div className="relative h-48">
                                {project.mainImage && (
                                    <Image src={project.mainImage} alt={project.title} fill className="object-cover" />
                                )}
                                <span className="absolute top-3 left-3 px-3 py-1 bg-deep-space-blue-600 text-white text-xs font-bold rounded-full">{project.scope}</span>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900">{project.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{project.location} • {project.year} • {project.area}m²</p>
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => handleOpenModal(project)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
                                        <Pencil className="w-4 h-4" /> Edit
                                    </button>
                                    <button onClick={() => project._id && handleDelete(project._id)} className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                            <button onClick={() => { setShowModal(false); setEditingProject(null) }} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Project Title</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" placeholder="e.g., Residential Villa" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Scope</label>
                                    <select value={formData.scope} onChange={(e) => setFormData({ ...formData, scope: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none">
                                        <option value="New Construction">New Construction</option>
                                        <option value="Renovation">Renovation</option>
                                        <option value="Interior Design">Interior Design</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Residential">Residential</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Year</label>
                                    <input type="text" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" placeholder="2024" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" placeholder="Yaoundé, Cameroon" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Area (m²)</label>
                                    <input type="text" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" placeholder="350" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none resize-none" placeholder="Project description..."></textarea>
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">Main Image</label>
                                <ImageUpload
                                    value={formData.mainImage}
                                    onChange={(url) => setFormData({ ...formData, mainImage: url })}
                                    onRemove={() => setFormData({ ...formData, mainImage: '' })}
                                    folder="medcon-sarl/projects"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Additional Images</label>
                                <div className="space-y-3">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="flex gap-2 items-start">
                                            <div className="flex-1">
                                                <ImageUpload
                                                    value={image}
                                                    onChange={(url) => updateImage(index, url)}
                                                    onRemove={() => removeImage(index)}
                                                    folder="medcon-sarl/projects"
                                                />
                                            </div>
                                            <button type="button" onClick={() => removeImage(index)} className="px-3 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 mt-12"><ImageMinus className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addImage} className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-deep-space-blue-500 hover:text-deep-space-blue-600">
                                        <ImagePlus className="w-4 h-4" /> Add Image
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-3">
                            <button onClick={() => { setShowModal(false); setEditingProject(null) }} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700 disabled:opacity-50">
                                {saving ? 'Saving...' : (editingProject ? 'Save Changes' : 'Add Project')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}