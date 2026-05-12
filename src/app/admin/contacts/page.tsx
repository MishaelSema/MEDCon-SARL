'use client'

import { useState } from 'react'
import { Mail, Phone, Send } from 'lucide-react'

const messages = [
    { id: '1', name: 'Jean Kamga', email: 'jean.kamga@email.com', phone: '+237 612 345 678', service: 'construction', message: 'Hi, I am interested in building a residential villa in Yaounde. Can you provide a quote?', status: 'unread', date: '2024-01-20 10:30' },
    { id: '2', name: 'Marie Nguema', email: 'marie.nguema@email.com', phone: '+237 678 901 234', service: 'renovation', message: 'We need someone to renovate our office space. It is about 200 square meters. Please contact me for details.', status: 'unread', date: '2024-01-19 14:15' },
    { id: '3', name: 'Paul Essomba', email: 'paul.essomba@email.com', phone: '+237 693 456 789', service: 'realEstate', message: 'I am looking for property management services in Douala. Can you help?', status: 'read', date: '2024-01-18 09:45' },
]

export default function ContactsPage() {
    const [list, setList] = useState(messages)
    const [selectedMessage, setSelectedMessage] = useState<any>(null)
    const [replyText, setReplyText] = useState('')

    const markAsRead = (id: string) => {
        setList(list.map(m => m.id === id ? { ...m, status: 'read' } : m))
    }

    const sendReply = () => {
        if (replyText.trim()) {
            alert(`Reply sent to ${selectedMessage.email}: ${replyText}`)
            setReplyText('')
            setSelectedMessage(null)
        }
    }

    return (
        <div>
            <div className="mb-6 flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">{list.filter(m => m.status === 'unread').length} Unread</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {list.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => { setSelectedMessage(msg); markAsRead(msg.id) }}
                                className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-deep-space-blue-50' : ''}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${msg.status === 'unread' ? 'bg-deep-space-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            {msg.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-bold ${msg.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>{msg.name}</h3>
                                                {msg.status === 'unread' && <span className="w-2 h-2 bg-deep-space-blue-600 rounded-full"></span>}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-0.5">{msg.email}</p>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{msg.message}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">{msg.date}</p>
                                        <p className="text-xs mt-1 px-2 py-1 bg-gray-100 rounded-full text-gray-600">{msg.service}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {selectedMessage ? (
                        <div className="h-full flex flex-col">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-bold text-gray-900">Message Details</h3>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 bg-deep-space-blue-100 rounded-full flex items-center justify-center text-deep-space-blue-600 font-bold text-lg">{selectedMessage.name.charAt(0)}</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{selectedMessage.name}</h4>
                                            <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <a href={`tel:${selectedMessage.phone}`} className="flex items-center gap-2 text-deep-space-blue-600 hover:underline">
                                            <Phone className="w-4 h-4" /> {selectedMessage.phone}
                                        </a>
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">{selectedMessage.service}</span>
                                    </div>
                                    <div className="p-4 bg-yellow-green-50 rounded-xl border-l-4 border-yellow-green-400">
                                        <p className="text-gray-700 leading-relaxed">{selectedMessage.message}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t bg-gray-50">
                                <h4 className="font-bold text-gray-900 mb-3">Send Reply</h4>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 rounded-xl bg-white border-2 border-gray-200 focus:border-deep-space-blue-500 focus:outline-none resize-none mb-3"
                                    placeholder="Type your reply here..."
                                ></textarea>
                                <button onClick={sendReply} className="flex items-center gap-2 px-6 py-3 bg-deep-space-blue-600 text-white font-bold rounded-xl hover:bg-deep-space-blue-700">
                                    <Send className="w-4 h-4" /> Send Reply
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