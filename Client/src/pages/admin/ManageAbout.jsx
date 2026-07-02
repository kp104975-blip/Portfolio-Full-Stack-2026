import React, { useEffect, useState } from 'react'
import API from '../../services/api'

function ManageAbout() {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        skills: "",
        achievements: ""
    });

    // Fetch About Data
    const fetchAbout = async () => {
        try {
            const res = await API.get("/about");
            console.log("About data fetched:", res.data.about);
            setAboutData(res.data.about);
        } catch (error) {
            console.log("Error fetching about section:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbout();
    }, []);

    // Open Edit Modal Handler
    const handleEdit = () => {
        setForm({
            title: aboutData?.title || "",
            description: aboutData?.description || "",
            skills: aboutData?.skills ? aboutData.skills.join(", ") : "",
            achievements: aboutData?.achievements ? aboutData.achievements.join(", ") : ""
        });
        setOpenModal(true);
    };

    // Input Change Handler
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Save/Update Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            // Backend handles splitting comma-separated strings inside controllers,
            // but we can send it either as arrays or strings. Let's send them directly.
            const payload = {
                title: form.title,
                description: form.description,
                skills: form.skills,
                achievements: form.achievements
            };

            let res;
            if (aboutData?._id) {
                res = await API.put(`/updateAbout/${aboutData._id}`, payload, {
                    withCredentials: true
                });
            } else {
                res = await API.post(`/createAbout`, payload, {
                    withCredentials: true
                });
            }

            alert(res.data.message || "About section saved successfully!");
            setOpenModal(false);
            fetchAbout();
        } catch (error) {
            console.error("Error saving about section:", error);
            alert(error.response?.data?.message || "Failed to save about section.");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section id="about" className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* TOP HEADER: Section Title + Edit Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Manage About Section
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Review and update your bio details, dynamic technical skills list, and key highlights.
                        </p>
                    </div>
                    <button
                        onClick={handleEdit}
                        className="bg-yellow-500 hover:bg-yellow-600 active:scale-95 px-6 py-3 rounded-2xl text-slate-950 font-bold shadow-lg shadow-yellow-600/10 transition duration-200 text-center"
                    >
                        {aboutData ? "Edit About" : "Create About"}
                    </button>
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* LEFT COLUMN: About Me + Technical Skills */}
                    <div className="space-y-12">
                        {/* About Me Info */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-white border-l-4 border-cyan-400 pl-4">
                                {aboutData?.title || "About Me"}
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                                {aboutData?.description || "No description set yet. Click Edit About to add your details."}
                            </p>
                        </div>

                        {/* Technical Skills */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-cyan-400">
                                Technical Skills
                            </h3>
                            {aboutData?.skills && aboutData.skills.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {aboutData.skills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center hover:border-cyan-400/50 hover:scale-105 transition duration-200 cursor-default font-medium text-slate-200"
                                        >
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500">No skills added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Achievements */}
                    <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl shadow-xl">
                        <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-purple-500 pl-4">
                            Achievements & Highlights
                        </h3>
                        {aboutData?.achievements && aboutData.achievements.length > 0 ? (
                            <div className="grid gap-4">
                                {aboutData.achievements.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md hover:border-purple-500/20 transition duration-200"
                                    >
                                        <span className="text-yellow-500 text-xl leading-none">★</span>
                                        <span className="text-slate-300 text-base font-medium leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500">No achievements added yet.</p>
                        )}
                    </div>

                </div>
            </div>

            {/* EDIT ABOUT MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl p-8 overflow-y-auto max-h-[90vh] shadow-2xl">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                            <h2 className="text-3xl font-extrabold text-white">
                                {aboutData ? "Update About Section" : "Create About Section"}
                            </h2>
                            <button
                                onClick={() => setOpenModal(false)}
                                className="text-slate-400 hover:text-white text-3xl transition duration-150"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Title */}
                            <div className="flex flex-col">
                                <label className="text-slate-300 font-semibold mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="e.g. About Me / My Background"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col">
                                <label className="text-slate-300 font-semibold mb-2">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={5}
                                    placeholder="Write a short summary about your background, experiences, and passion..."
                                    value={form.description}
                                    onChange={handleChange}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition resize-none"
                                ></textarea>
                            </div>

                            {/* Skills (Comma Separated) */}
                            <div className="flex flex-col">
                                <label className="text-slate-300 font-semibold mb-2">Technical Skills (Comma separated)</label>
                                <textarea
                                    name="skills"
                                    rows={2}
                                    placeholder="e.g. React, Node.js, Express, MongoDB, AWS, Docker"
                                    value={form.skills}
                                    onChange={handleChange}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition resize-none"
                                ></textarea>
                                <span className="text-xs text-slate-500 mt-1">Separate individual skills using commas.</span>
                            </div>

                            {/* Achievements (Comma Separated) */}
                            <div className="flex flex-col">
                                <label className="text-slate-300 font-semibold mb-2">Achievements (Comma separated)</label>
                                <textarea
                                    name="achievements"
                                    rows={3}
                                    placeholder="e.g. Certified AWS Developer Associate, Mentored 50+ students in web development, Built 15+ production-grade products"
                                    value={form.achievements}
                                    onChange={handleChange}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition resize-none"
                                ></textarea>
                                <span className="text-xs text-slate-500 mt-1">Separate individual achievements using commas.</span>
                            </div>

                            {/* Action Button */}
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.01] active:scale-95 py-4 rounded-2xl text-white font-bold transition shadow-lg shadow-cyan-950/20 disabled:opacity-50"
                            >
                                {submitLoading ? "Saving Changes..." : "Save About Section"}
                            </button>

                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ManageAbout;