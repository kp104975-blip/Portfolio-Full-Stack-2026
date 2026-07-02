import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaEnvelopeOpen, FaUser, FaRegCalendarAlt, FaReply, FaInbox } from 'react-icons/fa';
import API from '../../services/api';

function ContactMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const fetchMessages = async () => {
        try {
            const res = await API.get('/getAllContact', { withCredentials: true });
            // Backend returns { message: "...", contacts: [...] }
            const list = res.data.contacts || [];
            // Sort by latest date first if timestamps exist
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMessages(list);
            if (list.length > 0) {
                setSelectedMessage(list[0]);
            }
        } catch (error) {
            console.error("Error fetching contact messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="text-white min-h-screen">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
                    <FaInbox className="text-cyan-400" /> Inbox
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Manage direct messages, queries, and proposals from your portfolio visitors.
                </p>
            </div>

            {messages.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-16 text-center max-w-2xl mx-auto mt-10">
                    <FaEnvelope className="text-slate-600 text-6xl mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-2">Your inbox is clean</h3>
                    <p className="text-slate-400">No visitor inquiries or messages have been received yet.</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-5 gap-8 items-start">
                    
                    {/* Left Column: Inbox List */}
                    <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden max-h-[75vh] flex flex-col">
                        <div className="bg-slate-900 border-b border-slate-800 p-5 flex justify-between items-center">
                            <span className="font-bold text-slate-200">All Messages</span>
                            <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold">
                                {messages.length} Total
                            </span>
                        </div>

                        <div className="overflow-y-auto flex-1 divide-y divide-slate-800/60">
                            {messages.map((msg) => {
                                const isSelected = selectedMessage?._id === msg._id;
                                const dateStr = new Date(msg.createdAt).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric'
                                });

                                return (
                                    <div
                                        key={msg._id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`p-5 cursor-pointer transition-all duration-200 hover:bg-slate-800/40 flex flex-col justify-between gap-2 ${
                                            isSelected ? 'bg-slate-800/60 border-l-4 border-cyan-400' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-bold text-white truncate max-w-[150px]">
                                                {msg.name}
                                            </h4>
                                            <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1">
                                                <FaRegCalendarAlt size={10} /> {dateStr}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-cyan-400 truncate">
                                            {msg.subject}
                                        </p>
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {msg.message}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Message Detail Pane */}
                    <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl min-h-[50vh] flex flex-col justify-between">
                        {selectedMessage ? (
                            <div className="space-y-6">
                                {/* Message Top Info */}
                                <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-cyan-400 border border-slate-850">
                                            <FaUser size={18} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white leading-tight">
                                                {selectedMessage.name}
                                            </h2>
                                            <a
                                                href={`mailto:${selectedMessage.email}`}
                                                className="text-sm text-cyan-400 hover:underline hover:text-cyan-300 transition"
                                            >
                                                {selectedMessage.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-500 sm:text-right">
                                        <p className="flex sm:justify-end items-center gap-1 font-medium mb-1">
                                            <FaRegCalendarAlt /> Received on:
                                        </p>
                                        <p className="font-semibold text-slate-400">
                                            {new Date(selectedMessage.createdAt).toLocaleString(undefined, {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject</span>
                                    <h3 className="text-xl font-bold text-white mt-1">
                                        {selectedMessage.subject}
                                    </h3>
                                </div>

                                {/* Content */}
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Message Content</span>
                                    <p className="text-slate-300 text-base leading-relaxed bg-slate-950 p-6 rounded-2xl border border-slate-850 whitespace-pre-line mt-2">
                                        {selectedMessage.message}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 flex justify-end">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                                        className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition active:scale-95 shadow-lg shadow-cyan-600/10"
                                    >
                                        <FaReply size={14} /> Reply Sender
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                                <FaEnvelopeOpen size={48} className="mb-4" />
                                <p>Select a message to view detail contents</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactMessages;