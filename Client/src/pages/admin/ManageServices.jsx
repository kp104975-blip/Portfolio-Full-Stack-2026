import React, { useEffect, useState } from 'react';
import { FaCode, FaServer, FaLaptopCode, FaAward, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import API from '../../services/api';

function ManageServices() {
    const [serviceData, setServiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Modal states
    const [openSectionModal, setOpenSectionModal] = useState(false);
    const [openCardModal, setOpenCardModal] = useState(false);
    const [editingCardIndex, setEditingCardIndex] = useState(null); // null for add, number for edit

    // Form states
    const [sectionForm, setSectionForm] = useState({
        title: "",
        description: ""
    });
    const [cardForm, setCardForm] = useState({
        title: "",
        description: ""
    });

    const fetchServices = async () => {
        try {
            const res = await API.get("/services");
            const data = res.data?.services || res.data?.service || res.data;
            setServiceData(data);
        } catch (error) {
            console.log("API Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Open Section Header Edit Modal
    const handleEditSection = () => {
        setSectionForm({
            title: serviceData?.title || "My Services",
            description: serviceData?.description || "What I Do"
        });
        setOpenSectionModal(true);
    };

    // Save Section Header Changes
    const handleSaveSection = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const payload = {
                title: sectionForm.title,
                description: sectionForm.description,
                headTitle: serviceData?.headTitle || [],
                headDescription: serviceData?.headDescription || []
            };

            let res;
            if (serviceData?._id) {
                res = await API.put(`/updateService/${serviceData._id}`, payload, { withCredentials: true });
            } else {
                res = await API.post(`/createService`, payload, { withCredentials: true });
            }

            alert(res.data.message || "Services section updated!");
            setOpenSectionModal(false);
            fetchServices();
        } catch (error) {
            console.error("Save section error:", error);
            alert(error.response?.data?.message || "Failed to update services section.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Open Card Modal for Add/Edit
    const handleOpenCardModal = (index = null) => {
        if (index !== null) {
            // Editing
            setEditingCardIndex(index);
            setCardForm({
                title: serviceData?.headTitle?.[index] || "",
                description: serviceData?.headDescription?.[index] || ""
            });
        } else {
            // Adding
            setEditingCardIndex(null);
            setCardForm({
                title: "",
                description: ""
            });
        }
        setOpenCardModal(true);
    };

    // Save Card changes (Add/Edit)
    const handleSaveCard = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            let updatedTitles = serviceData?.headTitle ? [...serviceData.headTitle] : [];
            let updatedDescriptions = serviceData?.headDescription ? [...serviceData.headDescription] : [];

            if (editingCardIndex !== null) {
                // Update existing
                updatedTitles[editingCardIndex] = cardForm.title;
                updatedDescriptions[editingCardIndex] = cardForm.description;
            } else {
                // Add new
                updatedTitles.push(cardForm.title);
                updatedDescriptions.push(cardForm.description);
            }

            const payload = {
                title: serviceData?.title || "My Services",
                description: serviceData?.description || "What I Do",
                headTitle: updatedTitles,
                headDescription: updatedDescriptions
            };

            let res;
            if (serviceData?._id) {
                res = await API.put(`/updateService/${serviceData._id}`, payload, { withCredentials: true });
            } else {
                res = await API.post(`/createService`, payload, { withCredentials: true });
            }

            alert(res.data.message || "Service card saved!");
            setOpenCardModal(false);
            fetchServices();
        } catch (error) {
            console.error("Save card error:", error);
            alert(error.response?.data?.message || "Failed to save service card.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Delete individual service card
    const handleDeleteService = async (index, title) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
        if (!confirmDelete) return;

        setLoading(true);
        try {
            let updatedTitles = serviceData?.headTitle ? [...serviceData.headTitle] : [];
            let updatedDescriptions = serviceData?.headDescription ? [...serviceData.headDescription] : [];

            // Remove item at index
            updatedTitles.splice(index, 1);
            updatedDescriptions.splice(index, 1);

            const payload = {
                title: serviceData?.title || "My Services",
                description: serviceData?.description || "What I Do",
                headTitle: updatedTitles,
                headDescription: updatedDescriptions
            };

            const res = await API.put(`/updateService/${serviceData._id}`, payload, { withCredentials: true });
            alert(res.data.message || "Service card deleted!");
            fetchServices();
        } catch (error) {
            console.error("Delete card error:", error);
            alert(error.response?.data?.message || "Failed to delete service card.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const finalTitles = serviceData?.headTitle || [];
    const finalDescriptions = serviceData?.headDescription || [];

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* TOP HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Manage Services
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Customize what services you offer and structure your developer showcase.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleEditSection}
                            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-yellow-500 font-bold px-6 py-3 rounded-2xl active:scale-95 transition"
                        >
                            Edit Section Info
                        </button>
                        <button
                            onClick={() => handleOpenCardModal(null)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl active:scale-95 transition flex items-center gap-2 shadow-lg shadow-emerald-950/20"
                        >
                            <FaPlus size={14} /> Add Service Card
                        </button>
                    </div>
                </div>

                {/* VISUAL LAYOUT STATE */}
                <div className="text-center bg-slate-900/40 p-8 border border-slate-900 rounded-3xl mb-8">
                    <p className="text-cyan-400 uppercase tracking-widest font-bold text-sm">
                        {serviceData?.title || "My Services"}
                    </p>
                    <h2 className="text-4xl font-extrabold mt-2 text-white">
                        {serviceData?.description || "What I Do"}
                    </h2>
                </div>

                {/* SERVICES CARDS GRID */}
                {finalTitles.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {finalTitles.map((title, index) => {
                            const icons = [<FaCode />, <FaServer />, <FaLaptopCode />, <FaAward />];
                            const icon = icons[index % icons.length];
                            const desc = finalDescriptions[index] || "No description loaded.";

                            return (
                                <div 
                                    key={index} 
                                    className="bg-slate-905 border border-slate-900 bg-slate-900/60 rounded-3xl p-8 hover:border-cyan-500/30 transition duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="text-cyan-400 text-3xl mb-6 bg-slate-950 w-14 h-14 flex items-center justify-center rounded-2xl border border-slate-800">
                                            {icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4">{title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80 mt-auto">
                                        <button
                                            onClick={() => handleOpenCardModal(index)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-yellow-500 hover:text-yellow-400 font-semibold py-2.5 px-4 rounded-xl transition text-sm border border-slate-700/50"
                                        >
                                            <FaEdit size={14} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(index, title)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 bg-red-950/30 hover:bg-red-900/40 active:scale-95 text-red-400 hover:text-red-300 font-semibold py-2.5 px-4 rounded-xl transition text-sm border border-red-900/30"
                                        >
                                            <FaTrashAlt size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-900">
                        <p className="text-slate-400 text-lg font-medium">No service cards exist yet. Click Add Service Card to create one!</p>
                    </div>
                )}
            </div>

            {/* SECTION EDIT MODAL */}
            {openSectionModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-8 shadow-2xl">
                        
                        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                            <h2 className="text-2xl font-extrabold text-white">
                                Edit Section Headers
                            </h2>
                            <button
                                onClick={() => setOpenSectionModal(false)}
                                className="text-slate-400 hover:text-white text-3xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveSection} className="space-y-6">
                            <div className="flex flex-col">
                                <label className="text-slate-300 font-semibold mb-2">Section Category (Tagline)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. My Services"
                                    value={sectionForm.title}
                                    onChange={(e) => setSectionForm({...sectionForm, title: e.target.value})}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-slate-300 font-semibold mb-2">Section Main Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. What I Do"
                                    value={sectionForm.description}
                                    onChange={(e) => setSectionForm({...sectionForm, description: e.target.value})}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full bg-cyan-500 hover:bg-cyan-600 py-4 rounded-2xl font-bold text-white transition disabled:opacity-50"
                            >
                                {submitLoading ? "Saving Changes..." : "Save Header Info"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* CARD ADD/EDIT MODAL */}
            {openCardModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-8 shadow-2xl">
                        
                        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                            <h2 className="text-2xl font-extrabold text-white">
                                {editingCardIndex !== null ? "Edit Service Card" : "Add Service Card"}
                            </h2>
                            <button
                                onClick={() => setOpenCardModal(false)}
                                className="text-slate-400 hover:text-white text-3xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveCard} className="space-y-6">
                            <div className="flex flex-col">
                                <label className="text-slate-300 font-semibold mb-2">Service Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Frontend Development"
                                    value={cardForm.title}
                                    onChange={(e) => setCardForm({...cardForm, title: e.target.value})}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-slate-300 font-semibold mb-2">Service Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="e.g. Building responsive single-page applications using React, Vite, and Tailwind CSS."
                                    value={cardForm.description}
                                    onChange={(e) => setCardForm({...cardForm, description: e.target.value})}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold text-white transition disabled:opacity-50"
                            >
                                {submitLoading ? "Saving Card..." : (editingCardIndex !== null ? "Update Service Card" : "Add Service Card")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ManageServices;