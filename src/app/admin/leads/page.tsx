'use client'

import { useState, useEffect } from 'react'
import { Download, Mail, Users, Trash2, Upload, Loader2, Eye, EyeOff } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'

interface Lead {
    _id: string
    name: string
    email: string
    source: string
    createdAt: string
}

interface Guide {
    title: string
    description: string
    downloadUrl: string
    enabled: boolean
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [guide, setGuide] = useState<Guide>({
        title: 'Get the Construction Guide for Free',
        description: 'Discover everything you need to know before starting your construction project.',
        downloadUrl: '',
        enabled: true,
    })
    const [saving, setSaving] = useState(false)
    const [showGuideSettings, setShowGuideSettings] = useState(false)

    useEffect(() => {
        fetchLeads()
    }, [])

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem('admin-token')
            const res = await fetch('/api/leads', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setLeads(data)
            }
        } catch (error) {
            console.error('Error fetching leads:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveGuide = async () => {
        setSaving(true)
        try {
            localStorage.setItem('guideSettings', JSON.stringify(guide))
            alert('Guide settings saved!')
        } catch (error) {
            console.error('Error saving guide:', error)
        } finally {
            setSaving(false)
        }
    }

    const exportLeads = () => {
        const csv = [
            ['Name', 'Email', 'Source', 'Date'],
            ...leads.map(l => [l.name, l.email, l.source, new Date(l.createdAt).toLocaleDateString()])
        ].map(row => row.join(',')).join('\n')
        
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
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
                <h1 className="text-2xl font-bold text-gray-900">Leads & Guide</h1>
                <div className="flex gap-3">
                    <button onClick={() => setShowGuideSettings(!showGuideSettings)} className="flex items-center gap-2 px-4 py-2 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700">
                        <Eye className="w-4 h-4" /> Guide Settings
                    </button>
                    <button onClick={exportLeads} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {showGuideSettings && (
                <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Construction Guide Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Enable/Disable Guide Section</label>
                            <button 
                                onClick={() => setGuide({ ...guide, enabled: !guide.enabled })}
                                className={`px-4 py-2 rounded-xl font-bold ${guide.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                                {guide.enabled ? 'Enabled' : 'Disabled'}
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                            <input 
                                type="text" 
                                value={guide.title} 
                                onChange={(e) => setGuide({ ...guide, title: e.target.value })} 
                                className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea 
                                rows={3}
                                value={guide.description} 
                                onChange={(e) => setGuide({ ...guide, description: e.target.value })} 
                                className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Download File (PDF)</label>
                            <ImageUpload
                                value={guide.downloadUrl}
                                onChange={(url) => setGuide({ ...guide, downloadUrl: url })}
                                onRemove={() => setGuide({ ...guide, downloadUrl: '' })}
                                folder="medcon-sarl/guides"
                            />
                            <p className="text-xs text-gray-400 mt-2">Upload a PDF file that will be sent to subscribers</p>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2">Or enter download URL manually:</label>
                            <input 
                                type="url" 
                                value={guide.downloadUrl} 
                                onChange={(e) => setGuide({ ...guide, downloadUrl: e.target.value })} 
                                className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveGuide} 
                            disabled={saving}
                            className="px-6 py-3 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-deep-space-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-deep-space-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{leads.length}</h2>
                        <p className="text-sm text-gray-500">Total Leads</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Source</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No leads yet. Share the guide to get subscribers!
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                                        <td className="px-6 py-4">
                                            <a href={`mailto:${lead.email}`} className="text-deep-space-blue-600 hover:underline flex items-center gap-1">
                                                <Mail className="w-4 h-4" /> {lead.email}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-deep-space-blue-50 text-deep-space-blue-700 text-sm rounded-full">
                                                {lead.source === 'construction-guide' ? 'Guide' : lead.source}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a 
                                                href={`mailto:${lead.email}`} 
                                                className="p-2 bg-deep-space-blue-50 text-deep-space-blue-600 rounded-lg hover:bg-deep-space-blue-100 inline-flex"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}