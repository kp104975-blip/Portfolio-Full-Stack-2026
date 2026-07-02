import React, { useState } from 'react';
import { FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import API from '../services/api';

function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post('/createContact', form);
            setSubmitted(true);
            setForm({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
            alert(res.data.message || "Message sent successfully!");
        } catch (error) {
            console.error("Error sending message:", error);
            alert(error.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-cyan-400 uppercase tracking-widest font-semibold text-sm">
                        Get In Touch
                    </p>
                    <h2 className="text-4xl md:text-5xl font-extrabold mt-3 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Let's Build Something Great
                    </h2>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    
                    {/* Left: Contact Info */}
                    <div className="lg:col-span-2 space-y-8 bg-slate-900/40 border border-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                            <p className="text-slate-400 leading-relaxed">
                                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to shoot a message!
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-cyan-400">
                                    <FaEnvelope size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email Me</p>
                                    <a href="mailto:yourname@gmail.com" className="text-slate-200 hover:text-cyan-400 transition font-medium">
                                        yourname@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-cyan-400">
                                    <FaMapMarkerAlt size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Location</p>
                                    <p className="text-slate-200 font-medium">New Delhi, India</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-cyan-400">
                                    <FaBriefcase size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Availability</p>
                                    <p className="text-slate-200 font-medium">Freelance / Full-Time / Remote</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA button */}
                        <div className="pt-4 border-t border-slate-800/80">
                            <a
                                href="mailto:yourname@gmail.com"
                                className="block text-center w-full bg-slate-950 border border-slate-800 hover:border-cyan-450 hover:bg-slate-800 text-cyan-400 font-bold py-4 px-6 rounded-2xl transition active:scale-95 shadow-md"
                            >
                                Hire Me Direct
                            </a>
                        </div>
                    </div>

                    {/* Right: Interactive Form */}
                    <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl">
                        {submitted ? (
                            <div className="text-center py-12 space-y-6">
                                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Thank you!</h3>
                                    <p className="text-slate-400 max-w-md mx-auto">
                                        Your message has been successfully recorded in the database. I will review it and get back to you as soon as possible.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition active:scale-95"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="flex flex-col">
                                        <label className="text-slate-350 font-semibold mb-2 text-sm">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Enter your name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                                        />
                                    </div>
                                    {/* Email */}
                                    <div className="flex flex-col">
                                        <label className="text-slate-350 font-semibold mb-2 text-sm">Your Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="Enter your email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="flex flex-col">
                                    <label className="text-slate-350 font-semibold mb-2 text-sm">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        required
                                        placeholder="e.g. Project Consultation / Inquiry"
                                        value={form.subject}
                                        onChange={handleChange}
                                        className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                                    />
                                </div>

                                {/* Message */}
                                <div className="flex flex-col">
                                    <label className="text-slate-350 font-semibold mb-2 text-sm">Message Description</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={5}
                                        placeholder="Write your message detail here..."
                                        value={form.message}
                                        onChange={handleChange}
                                        className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition resize-none"
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.01] active:scale-95 py-4 rounded-2xl text-white font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                                >
                                    <FaPaperPlane size={14} />
                                    {loading ? "Sending Message..." : "Send Message"}
                                </button>
                            </form>
                        )}
                    </div>

                </div>

            </div>
        </section>
    );
}

export default Contact;