'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, X, ImagePlus, ImageMinus, Loader2, Database } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import { useLanguage } from '@/context/LanguageContext'

interface BilingualField {
    en: string
    fr: string
}

interface FeaturesBilingual {
    en: string[]
    fr: string[]
}

interface Project {
    _id?: string
    title: string | BilingualField
    scope: string
    location: string
    year: string
    area: string
    description: string | BilingualField
    features: string[] | FeaturesBilingual
    images: string[]
    mainImage: string
    status: string
    serviceIds?: string[]
}

interface ServiceOption {
    _id: string
    title: string | BilingualField
}

export default function PortfolioPage() {
    const { language } = useLanguage()
    const [projects, setProjects] = useState<Project[]>([])
    const [services, setServices] = useState<ServiceOption[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [saving, setSaving] = useState(false)
    const [seeding, setSeeding] = useState(false)
    const [formData, setFormData] = useState<Project>({
        title: { en: '', fr: '' },
        scope: 'New Construction',
        location: '',
        year: '',
        area: '',
        description: { en: '', fr: '' },
        features: { en: [], fr: [] },
        images: [],
        mainImage: '',
        status: 'active',
        serviceIds: [],
    })
    const [newFeatureEn, setNewFeatureEn] = useState('')
    const [newFeatureFr, setNewFeatureFr] = useState('')

    useEffect(() => {
        fetchProjects()
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
        }
    }

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

    const getLocalizedText = (text: string | BilingualField): string => {
        if (typeof text === 'string') return text
        return language === 'fr' ? (text.fr || text.en) : (text.en || '')
    }

    const getLocalizedTitle = (project: Project): string => getLocalizedText(project.title as string | BilingualField)

    const seedDefaultProjects = async () => {
        if (!confirm('This will replace existing projects with 5 default projects. Continue?')) return
        setSeeding(true)
        try {
            const token = localStorage.getItem('admin-token')
            const res = await fetch('/api/admin/seed/projects', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                await fetchProjects()
                alert('5 default projects added!')
            }
        } catch (error) {
            console.error('Error seeding projects:', error)
        } finally {
            setSeeding(false)
        }
    }

    const handleOpenModal = (project: Project | null = null) => {
        if (project) {
            const title = project.title
            const description = project.description
            const features = project.features

            setFormData({
                _id: project._id,
                title: typeof title === 'string' ? { en: title, fr: '' } : (title || { en: '', fr: '' }),
                scope: project.scope || 'New Construction',
                location: project.location || '',
                year: project.year || '',
                area: project.area || '',
                description: typeof description === 'string' ? { en: description, fr: '' } : (description || { en: '', fr: '' }),
                features: Array.isArray(features) 
                    ? { en: features as string[], fr: [] }
                    : (features || { en: [], fr: [] }),
                images: project.images || [],
                mainImage: project.mainImage || '',
                status: project.status || 'active',
                serviceIds: project.serviceIds || [],
            })
        } else {
            setFormData({
                title: { en: '', fr: '' },
                scope: 'New Construction',
                location: '',
                year: '',
                area: '',
                description: { en: '', fr: '' },
                features: { en: [], fr: [] },
                images: [],
                mainImage: '',
                status: 'active',
                serviceIds: [],
            })
        }
        setEditingProject(project)
        setShowModal(true)
    }

    const getCurrentFeatures = () => {
        const features = formData.features
        if (Array.isArray(features)) return features
        return language === 'fr' ? features.fr : features.en
    }

    const setCurrentFeatures = (newFeatures: string[]) => {
        const features = formData.features
        if (Array.isArray(features)) {
            setFormData({ ...formData, features: newFeatures })
        } else {
            if (language === 'fr') {
                setFormData({ ...formData, features: { ...(features as FeaturesBilingual), fr: newFeatures } })
            } else {
                setFormData({ ...formData, features: { ...(features as FeaturesBilingual), en: newFeatures } })
            }
        }
    }

    const addFeature = () => {
        const currentLang = language === 'fr' ? newFeatureFr : newFeatureEn
        if (currentLang.trim()) {
            const currentFeatures = getCurrentFeatures()
            setCurrentFeatures([...currentFeatures, currentLang.trim()])
            if (language === 'fr') setNewFeatureFr('')
            else setNewFeatureEn('')
        }
    }

    const removeFeature = (index: number) => {
        const currentFeatures = [...getCurrentFeatures()]
        currentFeatures.splice(index, 1)
        setCurrentFeatures(currentFeatures)
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

    const updateBilingualField = (field: 'title' | 'description', lang: 'en' | 'fr', value: string) => {
        const current = formData[field] as BilingualField
        setFormData({
            ...formData,
            [field]: { ...current, [lang]: value }
        })
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('admin-token')
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
                const data = await res.json()
                alert(data.error || 'Failed to save project')
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
            const token = localStorage.getItem('admin-token')
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
                <div className="flex gap-3">
                    {projects.length === 0 && (
                        <button onClick={seedDefaultProjects} disabled={seeding} className="flex items-center gap-2 px-4 py-2 bg-yellow-green-500 text-deep-space-blue-900 font-bold rounded-xl hover:bg-yellow-green-400 disabled:opacity-50">
                            <Database className="w-4 h-4" /> {seeding ? 'Seeding...' : 'Seed Default Projects'}
                        </button>
                    )}
                    <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700">
                        <Plus className="w-4 h-4" /> Add Project
                    </button>
                </div>
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
                                    <Image src={project.mainImage} alt={String(getLocalizedTitle(project))} fill className="object-cover" />
                                )}
                                <span className="absolute top-3 left-3 px-3 py-1 bg-deep-space-blue-600 text-white text-xs font-bold rounded-full">{project.scope}</span>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900">{String(getLocalizedTitle(project))}</h3>
                                <p className="text-sm text-gray-500 mt-1">{project.location} - {project.year} - {project.area}m2</p>
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">Project Title (English)</label>
                                <input 
                                    type="text" 
                                    value={(formData.title as BilingualField)?.en || ''} 
                                    onChange={(e) => updateBilingualField('title', 'en', e.target.value)} 
                                    className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" 
                                    placeholder="e.g., Residential Villa" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Project Title (French)</label>
                                <input 
                                    type="text" 
                                    value={(formData.title as BilingualField)?.fr || ''} 
                                    onChange={(e) => updateBilingualField('title', 'fr', e.target.value)} 
                                    className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" 
                                    placeholder="e.g., Villa Residentielle" 
                                />
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
                                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" placeholder="Yaounde, Cameroon" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Area (m2)</label>
                                    <input type="text" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" placeholder="350" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description (English)</label>
                                <textarea 
                                    rows={3} 
                                    value={(formData.description as BilingualField)?.en || ''} 
                                    onChange={(e) => updateBilingualField('description', 'en', e.target.value)} 
                                    className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none resize-none" 
                                    placeholder="Project description in English..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description (French)</label>
                                <textarea 
                                    rows={3} 
                                    value={(formData.description as BilingualField)?.fr || ''} 
                                    onChange={(e) => updateBilingualField('description', 'fr', e.target.value)} 
                                    className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none resize-none" 
                                    placeholder="Project description in French..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Features (English) - {language === 'en' ? 'Currently editing' : 'Currently in French'}
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input 
                                        type="text" 
                                        value={language === 'fr' ? newFeatureFr : newFeatureEn} 
                                        onChange={(e) => language === 'fr' ? setNewFeatureFr(e.target.value) : setNewFeatureEn(e.target.value)} 
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} 
                                        className="flex-1 p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none" 
                                        placeholder={language === 'en' ? 'Add a feature...' : 'Ajouter une caracteristique...'} 
                                    />
                                    <button type="button" onClick={addFeature} className="px-4 py-3 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700"><Plus className="w-4 h-4" /></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {getCurrentFeatures().map((feature, index) => (
                                        <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-deep-space-blue-50 text-deep-space-blue-700 rounded-full text-sm">
                                            {feature}
                                            <button type="button" onClick={() => removeFeature(index)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Switch language to add features in the other language</p>
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
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Related Services (Optional)</label>
                                <p className="text-xs text-gray-500 mb-3">Link this project to related services</p>
                                <div className="space-y-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl p-3">
                                    {services.length === 0 ? (
                                        <p className="text-sm text-gray-500">No services available. Create services first.</p>
                                    ) : (
                                        services.map((service) => (
                                            <label key={service._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                                <input 
                                                    type="checkbox"
                                                    checked={formData.serviceIds?.includes(service._id) || false}
                                                    onChange={(e) => {
                                                        const current = formData.serviceIds || []
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, serviceIds: [...current, service._id] })
                                                        } else {
                                                            setFormData({ ...formData, serviceIds: current.filter(id => id !== service._id) })
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded border-gray-300 text-deep-space-blue-600 focus:ring-deep-space-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{getLocalizedText(service.title as string | BilingualField)}</span>
                                            </label>
                                        ))
                                    )}
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