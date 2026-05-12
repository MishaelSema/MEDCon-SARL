'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, Send, Trash2, CheckCircle } from 'lucide-react'

interface ContactMessage {
    _id: string
    name: string
    email: string
    phone?: string
    service?: string
    message: string
    createdAt: string
    read: boolean
    reply?: string
    repliedAt?: string
}

export default function ContactsPage() {
    const [list, setList] = useState<ContactMessage[]>([])
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [replyText, setReplyText] = useState('')
    const [sending, setSending] = useState(false)

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        const token = localStorage.getItem('admin-token')
        if (!token) return

        try {
            const res = await fetch('/api/contact', { headers: { Authorization: `Bearer ${token}` } })
            if (res.ok) {
                const data = await res.json()
                setList(data)
            }
        } catch (error) {
            console.error('Error fetching contacts:', error)
        }
    }

    const markAsRead = async (id: string) => {
        const token = localStorage.getItem('admin-token')
        try {
            await fetch('/api/contact', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ id, read: true })
            })
            setList(list.map(m => m._id === id ? { ...m, read: true } : m))
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    const deleteMessage = async (id: string) => {
        const token = localStorage.getItem('admin-token')
        if (!confirm('Delete this message?')) return

        try {
            await fetch(`/api/contact?id=${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            setList(list.filter(m => m._id !== id))
            if (selectedMessage?._id === id) setSelectedMessage(null)
        } catch (error) {
            console.error('Error deleting message:', error)
        }
    }

    const sendReply = async () => {
        if (!replyText.trim() || !selectedMessage) return
        
        const token = localStorage.getItem('admin-token')
        if (!token) return
        
        setSending(true)
        try {
            const res = await fetch('/api/contact', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ 
                    id: selectedMessage._id, 
                    reply: replyText,
                    repliedAt: new Date().toISOString()
                })
            })
            
            if (res.ok) {
                const updatedMessage = { ...selectedMessage, reply: replyText, repliedAt: new Date().toISOString() }
                setSelectedMessage(updatedMessage)
                setList(list.map(m => m._id === selectedMessage._id ? updatedMessage : m))
                setReplyText('')
                alert('Reply sent successfully!')
            } else {
                alert('Failed to send reply')
            }
        } catch (error) {
            console.error('Error sending reply:', error)
            alert('Failed to send reply')
        } finally {
            setSending(false)
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div>
            <div className="mb-6 flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">{list.filter(m => !m.read).length} Unread</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {list.length > 0 ? list.map((msg) => (
                            <div
                                key={msg._id}
                                onClick={() => { setSelectedMessage(msg); markAsRead(msg._id) }}
                                className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?._id === msg._id ? 'bg-deep-space-blue-50' : ''}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${!msg.read ? 'bg-deep-space-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            {msg.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-bold ${!msg.read ? 'text-gray-900' : 'text-gray-700'}`}>{msg.name}</h3>
                                                {!msg.read && <span className="w-2 h-2 bg-deep-space-blue-600 rounded-full"></span>}
                                                {msg.reply && <CheckCircle className="w-4 h-4 text-green-500" />}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-0.5">{msg.email}</p>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{msg.message}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <p className="text-xs text-gray-400">{formatDate(msg.createdAt)}</p>
                                        {msg.service && <p className="text-xs mt-1 px-2 py-1 bg-gray-100 rounded-full text-gray-600">{msg.service}</p>}
                                        <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id) }} className="text-red-400 hover:text-red-600 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-8">No messages yet</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {selectedMessage ? (
                        <div className="h-full flex flex-col">
                            <div className="p-6 border-b flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-900">Message Details</h3>
                                    {selectedMessage.reply && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                            <CheckCircle className="w-3 h-3" /> Replied
                                        </span>
                                    )}
                                </div>
                                <button onClick={() => deleteMessage(selectedMessage._id)} className="text-red-400 hover:text-red-600 p-2">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="w-12 h-12 bg-deep-space-blue-100 rounded-full flex items-center justify-center text-deep-space-blue-600 font-bold text-lg">{selectedMessage.name?.charAt(0)}</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{selectedMessage.name}</h4>
                                        <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    {selectedMessage.phone && (
                                        <a href={`tel:${selectedMessage.phone}`} className="flex items-center gap-2 text-deep-space-blue-600 hover:underline">
                                            <Phone className="w-4 h-4" /> {selectedMessage.phone}
                                        </a>
                                    )}
                                    {selectedMessage.service && <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">{selectedMessage.service}</span>}
                                </div>
                                <div className="p-4 bg-yellow-green-50 rounded-xl border-l-4 border-yellow-green-400">
                                    <p className="text-sm text-gray-500 mb-1">Message:</p>
                                    <p className="text-gray-700 leading-relaxed">{selectedMessage.message}</p>
                                </div>
                                
                                {selectedMessage.reply && (
                                    <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <p className="text-sm font-bold text-green-700">Your Reply</p>
                                            {selectedMessage.repliedAt && (
                                                <span className="text-xs text-green-600">({formatDate(selectedMessage.repliedAt)})</span>
                                            )}
                                        </div>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.reply}</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 border-t bg-gray-50">
                                <h4 className="font-bold text-gray-900 mb-3">
                                    {selectedMessage.reply ? 'Edit Reply' : 'Send Reply'}
                                </h4>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows={4}
                                    className="w-full p-3 rounded-xl bg-white border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none resize-none mb-3"
                                    placeholder="Type your reply here... This will be sent to the customer's email."
                                    defaultValue={selectedMessage.reply || ''}
                                ></textarea>
                                <button 
                                    onClick={sendReply} 
                                    disabled={sending || !replyText.trim()}
                                    className="flex items-center gap-2 px-6 py-3 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 p-8 text-center">
                            <div>
                                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Select a message to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}