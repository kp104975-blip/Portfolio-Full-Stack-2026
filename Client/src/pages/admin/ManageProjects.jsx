import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaExternalLinkAlt, FaGithub, FaPlus, FaCheckSquare, FaSquare, FaTimes } from 'react-icons/fa';
import API from '../../services/api';

function ManageProjects() {
    //=================== State =================
    const [projectData, setProjectData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Batch Management States
    const [isSelectableMode, setIsSelectableMode] = useState(false);
    const [selectionType, setSelectionType] = useState(null); // 'edit' ya 'delete'
    const [selectedProjectIds, setSelectedProjectIds] = useState([]);

    // Modal & Form States
    const [openModal, setOpenModal] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null); // null if adding, ID if editing
    const [imageFile, setImageFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        liveLink: "",
        githubLink: "",
        technologies: ""
    });

    //========================== Get Data ===================
    const fetchProjects = async () => {
        try {
            const res = await API.get("/getAllProjects");
            console.log("Project data fetched:", res.data.projects);
            setProjectData(res.data.projects || []);
        } catch (error) {
            console.log("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    //========================== Selection Logic ===================
    const handleToggleSelectProject = (id) => {
        if (selectionType === 'edit') {
            setSelectedProjectIds([id]);
        } else {
            if (selectedProjectIds.includes(id)) {
                setSelectedProjectIds(selectedProjectIds.filter(item => item !== id));
            } else {
                setSelectedProjectIds([...selectedProjectIds, id]);
            }
        }
    };

    const handleCancelMode = () => {
        setIsSelectableMode(false);
        setSelectionType(null);
        setSelectedProjectIds([]);
    };

    //========================== Modal Controls ===================
    const handleAddProject = () => {
        setEditingProjectId(null);
        setImageFile(null);
        setForm({
            title: "",
            description: "",
            liveLink: "",
            githubLink: "",
            technologies: ""
        });
        setOpenModal(true);
    };

    const handleOpenEditModal = (project) => {
        setEditingProjectId(project._id);
        setImageFile(null);
        setForm({
            title: project.title || "",
            description: project.description || "",
            liveLink: project.liveLink || "",
            githubLink: project.githubLink || "",
            technologies: project.technologies ? project.technologies.join(", ") : ""
        });
        setOpenModal(true);
    };

    const handleExecuteAction = () => {
        if (selectedProjectIds.length === 0) {
            alert("Kripya pehle kisi project par tick karein!");
            return;
        }

        if (selectionType === 'edit') {
            const projectToEdit = projectData.find(p => p._id === selectedProjectIds[0]);
            handleOpenEditModal(projectToEdit);
            handleCancelMode();
        }

        if (selectionType === 'delete') {
            const confirmDelete = window.confirm(`Kya aap in ${selectedProjectIds.length} selected projects ko delete karna chahte hain?`);
            if (confirmDelete) {
                executeBulkDelete();
            }
        }
    };

    // Delete Loop
    const executeBulkDelete = async () => {
        setLoading(true);
        try {
            for (const id of selectedProjectIds) {
                await API.delete(`/deleteProject/${id}`, { withCredentials: true });
            }
            alert("Projects deleted successfully!");
            handleCancelMode();
            fetchProjects();
        } catch (error) {
            console.error("Bulk delete error:", error);
            alert("Failed to delete some projects.");
            setLoading(false);
        }
    };

    // Delete Single Project
    const handleDeleteSingle = async (id, title) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
        if (!confirmDelete) return;

        setLoading(true);
        try {
            await API.delete(`/deleteProject/${id}`, { withCredentials: true });
            alert("Project deleted successfully!");
            fetchProjects();
        } catch (error) {
            console.error("Delete project error:", error);
            alert("Failed to delete project.");
            setLoading(false);
        }
    };

    // Input Change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // File change
    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // Form Submit (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editingProjectId && !imageFile) {
            alert("Project image is required.");
            return;
        }

        setSubmitLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("liveLink", form.liveLink);
            formData.append("githubLink", form.githubLink);
            formData.append("technologies", form.technologies);

            if (imageFile) {
                formData.append("image", imageFile);
            }

            let res;
            if (editingProjectId) {
                res = await API.put(`/updateProject/${editingProjectId}`, formData, {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                res = await API.post(`/createProject`, formData, {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            alert(res.data.message || "Project saved successfully!");
            setOpenModal(false);
            fetchProjects();
        } catch (error) {
            console.error("Form submit error:", error);
            alert(error.response?.data?.message || "Failed to save project.");
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
        <section id="projects" className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white min-h-screen antialiased">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* HEADER CONTROL DASHBOARD */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-800 pb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Manage Projects Dashboard
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            {isSelectableMode 
                                ? `Select projects to perform bulk ${selectionType === 'edit' ? 'Editing' : 'Deletion'}` 
                                : "Add new entries or manage existing active items dynamically."
                            }
                        </p>
                    </div>

                    {/* TOP DYNAMIC BUTTONS AREA */}
                    <div className="flex flex-wrap items-center gap-3">
                        {!isSelectableMode ? (
                            <>
                                <button
                                    onClick={handleAddProject}
                                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 px-5 py-2.5 rounded-xl text-white font-semibold transition text-sm shadow-md shadow-emerald-950/20"
                                >
                                    <FaPlus size={14} /> Add Project
                                </button>
                                <button
                                    onClick={() => { setIsSelectableMode(true); setSelectionType('edit'); }}
                                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 px-5 py-2.5 rounded-xl text-yellow-500 font-semibold transition text-sm border border-slate-700/50"
                                >
                                    <FaEdit size={14} /> Edit Bulk
                                </button>
                                <button
                                    onClick={() => { setIsSelectableMode(true); setSelectionType('delete'); }}
                                    className="inline-flex items-center gap-2 bg-red-950/20 hover:bg-red-900/30 active:scale-95 px-5 py-2.5 rounded-xl text-red-400 font-semibold transition text-sm border border-red-900/20"
                                >
                                    <FaTrashAlt size={14} /> Delete Bulk
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancelMode}
                                    className="bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-xl text-slate-300 font-semibold text-sm transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExecuteAction}
                                    disabled={selectedProjectIds.length === 0}
                                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-lg ${
                                        selectedProjectIds.length === 0 
                                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                                            : selectionType === 'edit' 
                                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-900/20' 
                                                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20'
                                    }`}
                                >
                                    {selectionType === 'edit' ? 'Confirm Edit Selection' : `Delete Selected (${selectedProjectIds.length})`}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* PROJECT DISPLAY CARDS GRID */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {Array.isArray(projectData) && projectData.length > 0 ? (
                        projectData.map((project, index) => {
                            const isSelected = selectedProjectIds.includes(project._id);

                            return (
                                <div
                                    key={project._id || index}
                                    onClick={() => isSelectableMode && handleToggleSelectProject(project._id)}
                                    className={`relative bg-slate-900/50 border rounded-3xl p-8 shadow-xl flex flex-col justify-between transition-all duration-200 
                                        ${isSelectableMode ? 'cursor-pointer select-none' : ''} 
                                        ${isSelected 
                                            ? selectionType === 'edit' 
                                                ? 'border-yellow-500 bg-yellow-950/10 shadow-yellow-950/20 scale-[0.99]' 
                                                : 'border-red-500 bg-red-950/10 shadow-red-950/20 scale-[0.99]' 
                                            : 'border-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    {/* TICK BOX CHECKBOX OVERLAY */}
                                    {isSelectableMode && (
                                        <div className="absolute top-5 right-5 z-20 bg-slate-900 p-1 rounded-lg">
                                            {isSelected ? (
                                                <FaCheckSquare className={selectionType === 'edit' ? 'text-yellow-500' : 'text-red-500'} size={24} />
                                            ) : (
                                                <FaSquare className="text-slate-700 hover:text-slate-500 transition" size={24} />
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        {/* Thumbnail Layer */}
                                        {project.image && (
                                            <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 border border-slate-800 bg-slate-900 relative">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                {isSelectableMode && !isSelected && <div className="absolute inset-0 bg-black/40"></div>}
                                            </div>
                                        )}

                                        <div className="h-2 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-6"></div>

                                        <h3 className="text-2xl font-bold mb-4 text-white">
                                            {project.title}
                                        </h3>

                                        <p className="text-slate-400 mb-6 line-clamp-3">
                                            {project.description}
                                        </p>

                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {project.technologies.map((tech, techIndex) => (
                                                    <span
                                                        key={techIndex}
                                                        className="text-xs font-medium bg-slate-900 border border-slate-800 text-cyan-400 px-3 py-1 rounded-full"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* FOOTER EXTERNAL LINKS & DIRECT ACTIONS */}
                                    <div className="flex flex-col gap-4 mt-4 border-t border-slate-800/80 pt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-4">
                                                {project.githubLink && (
                                                    <a
                                                        href={project.githubLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        disabled={isSelectableMode}
                                                        className={`flex items-center gap-2 text-slate-400 font-semibold ${isSelectableMode ? 'pointer-events-none opacity-30' : 'hover:text-white transition'}`}
                                                    >
                                                        <FaGithub size={20} /> GitHub
                                                    </a>
                                                )}
                                                {project.liveLink && (
                                                    <a
                                                        href={project.liveLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        disabled={isSelectableMode}
                                                        className={`flex items-center gap-2 font-semibold ${isSelectableMode ? 'pointer-events-none opacity-30' : 'text-cyan-400 hover:text-cyan-300 transition'}`}
                                                    >
                                                        Live <FaExternalLinkAlt size={12} />
                                                    </a>
                                                )}
                                            </div>

                                            {/* Direct Edit / Delete buttons if not in selection mode */}
                                            {!isSelectableMode && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleOpenEditModal(project); }}
                                                        className="bg-slate-800 hover:bg-slate-700 text-yellow-500 p-2 rounded-xl border border-slate-750 transition"
                                                    >
                                                        <FaEdit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteSingle(project._id, project.title); }}
                                                        className="bg-red-950/30 hover:bg-red-900/40 text-red-400 p-2 rounded-xl border border-red-900/30 transition"
                                                    >
                                                        <FaTrashAlt size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-20 bg-slate-900/20 rounded-3xl border border-slate-800">
                            <p className="text-slate-400 text-xl font-medium">No projects available yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ADD/EDIT PROJECT MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl p-8 overflow-y-auto max-h-[90vh] shadow-2xl">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                            <h2 className="text-3xl font-extrabold text-white">
                                {editingProjectId ? "Edit Project Details" : "Add New Project"}
                            </h2>
                            <button
                                onClick={() => setOpenModal(false)}
                                className="text-slate-400 hover:text-white transition duration-150"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Title */}
                            <div className="flex flex-col">
                                <label className="text-slate-300 font-semibold mb-2">Project Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="e.g. Portfolio Builder Website"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col">
                                <label className="text-slate-300 font-semibold mb-2">Project Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    placeholder="Write a clear summary of what the project does, key features, and accomplishments..."
                                    value={form.description}
                                    onChange={handleChange}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition resize-none"
                                ></textarea>
                            </div>

                            {/* Links Grid */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-slate-300 font-semibold mb-2">Live Demo URL</label>
                                    <input
                                        type="url"
                                        name="liveLink"
                                        required
                                        placeholder="https://example.com"
                                        value={form.liveLink}
                                        onChange={handleChange}
                                        className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-slate-300 font-semibold mb-2">GitHub URL</label>
                                    <input
                                        type="url"
                                        name="githubLink"
                                        required
                                        placeholder="https://github.com/username/project"
                                        value={form.githubLink}
                                        onChange={handleChange}
                                        className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                                    />
                                </div>
                            </div>

                            {/* Technologies */}
                            <div className="flex flex-col">
                                <label className="text-slate-300 font-semibold mb-2">Technologies (Comma separated)</label>
                                <input
                                    type="text"
                                    name="technologies"
                                    required
                                    placeholder="e.g. React, Node.js, Express, MongoDB, TailwindCSS"
                                    value={form.technologies}
                                    onChange={handleChange}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                                />
                                <span className="text-xs text-slate-500 mt-1">Separate technologies with commas.</span>
                            </div>

                            {/* Image Upload */}
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                {editingProjectId && !imageFile && (
                                    <div className="w-24 h-24 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex-shrink-0">
                                        <img
                                            src={projectData.find(p => p._id === editingProjectId)?.image}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                {imageFile && (
                                    <div className="w-24 h-24 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex-shrink-0">
                                        <img
                                            src={URL.createObjectURL(imageFile)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 w-full">
                                    <label className="text-slate-300 font-semibold block mb-2">Project Thumbnail Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required={!editingProjectId}
                                        className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none w-full cursor-pointer file:bg-slate-800 file:border-none file:text-white file:px-4 file:py-2 file:rounded-xl file:mr-4 file:font-semibold hover:file:bg-slate-700"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.01] active:scale-95 py-4 rounded-2xl text-white font-bold transition disabled:opacity-50"
                            >
                                {submitLoading ? "Processing Request..." : (editingProjectId ? "Update Project Details" : "Create Project Entry")}
                            </button>

                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ManageProjects;