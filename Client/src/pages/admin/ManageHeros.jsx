import React, { useEffect, useState } from "react";
import API from "../../services/api";

function ManageHero() {

    // ================= STATE =================

    const [hero, setHero] = useState(null);

    const [openModal, setOpenModal] = useState(false);

    const [image, setImage] = useState(null);

    const [form, setForm] = useState({
        name: "",
        frontendTitle: "",
        backendTitle: "",
        subtitle: "",
        description: "",
        github: "",
        linkedin: "",
        instagram: "",
        resumeLink: "",
    });

    // ================= GET HERO =================

    const fetchHero = async () => {

        try {

            const res = await API.get("/getAllHero");

            setHero(res.data.hero);

        } catch (error) {

            console.log(error);
        }
    };

    useEffect(() => {

        fetchHero();

    }, []);

    // ================= OPEN EDIT MODAL =================

    const handleEdit = () => {

        setOpenModal(true);

        setForm({
            name: hero.name || "",
            frontendTitle: hero.frontendTitle || "",
            backendTitle: hero.backendTitle || "",
            subtitle: hero.subtitle || "",
            description: hero.description || "",
            github: hero.github || "",
            linkedin: hero.linkedin || "",
            instagram: hero.instagram || "",
            resumeLink: hero.resumeLink || "",
        });
    };

    // ================= HANDLE CHANGE =================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ================= HANDLE IMAGE =================

    const handleImage = (e) => {

        setImage(e.target.files[0]);
    };

    // ================= UPDATE HERO =================

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("subtitle", form.subtitle);
            formData.append("frontendTitle", form.frontendTitle);
            formData.append("backendTitle", form.backendTitle);
            formData.append("description", form.description);
            formData.append("github", form.github);
            formData.append("linkedin", form.linkedin);
            formData.append("instagram", form.instagram);
            formData.append("resumeLink", form.resumeLink);

            // image
            if (image) {

                formData.append("profileImage", image);
            }

            const res = await API.put(

                `/updateHero/${hero._id}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert(res.data.message);

            setOpenModal(false);

            fetchHero();

        } catch (error) {

            console.log(error);

            alert(error.response?.data?.message);
        }
    };

    return (
        <div className="p-6">

            {/* HEADING */}
            <h1 className="text-4xl font-bold mb-8 text-white">
                Manage Hero
            </h1>

            {/* HERO CARD */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden">

                {/* TOP */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-40"></div>

                {/* CONTENT */}
                <div className="p-8 relative">

                    {/* IMAGE */}
                    <div className="absolute -top-16 left-8">

                        <img
                            src={hero?.profileImage}
                            alt={hero?.name}
                            className="w-32 h-32 rounded-full border-4 border-slate-900 object-cover"
                        />

                    </div>

                    {/* BUTTON */}
                    <div className="flex justify-end">

                        <button
                            onClick={handleEdit}
                            className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-xl text-white font-semibold transition"
                        >
                            Edit Hero
                        </button>

                    </div>

                    {/* INFO */}
                    <div className="mt-16 grid lg:grid-cols-2 gap-10">

                        {/* LEFT */}
                        <div>

                            <h2 className="text-4xl font-bold text-white">
                                {hero?.name}
                            </h2>

                            <p className="text-cyan-400 mt-3 text-lg">
                                {hero?.subtitle}
                            </p>

                            <p className="text-slate-300 mt-6 leading-relaxed">
                                {hero?.description}
                            </p>

                        </div>

                        {/* RIGHT */}
                        <div className="grid sm:grid-cols-2 gap-6">

                            <div className="bg-slate-800 p-5 rounded-2xl">
                                <h3 className="text-slate-400 mb-2">
                                    Frontend
                                </h3>

                                <p className="text-white font-semibold">
                                    {hero?.frontendTitle}
                                </p>
                            </div>

                            <div className="bg-slate-800 p-5 rounded-2xl">
                                <h3 className="text-slate-400 mb-2">
                                    Backend
                                </h3>

                                <p className="text-white font-semibold">
                                    {hero?.backendTitle}
                                </p>
                            </div>

                            <div className="bg-slate-800 p-5 rounded-2xl">
                                <h3 className="text-slate-400 mb-2">
                                    GitHub
                                </h3>

                                <a
                                    href={hero?.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-cyan-400 hover:underline"
                                >
                                    Open GitHub
                                </a>
                            </div>

                            <div className="bg-slate-800 p-5 rounded-2xl">
                                <h3 className="text-slate-400 mb-2">
                                    LinkedIn
                                </h3>

                                <a
                                    href={hero?.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-cyan-400 hover:underline"
                                >
                                    Open LinkedIn
                                </a>
                            </div>

                            <div className="bg-slate-800 p-5 rounded-2xl sm:col-span-2">
                                <h3 className="text-slate-400 mb-2">
                                    Instagram
                                </h3>

                                <a
                                    href={hero?.instagram}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-cyan-400 hover:underline"
                                >
                                    Open Instagram
                                </a>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================= MODAL ================= */}

            {openModal && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

                    <div className="bg-slate-900 w-full max-w-5xl rounded-3xl p-8 overflow-y-auto max-h-[90vh]">

                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-8">

                            <h2 className="text-3xl font-bold text-white">
                                Update Hero
                            </h2>

                            <button
                                onClick={() => setOpenModal(false)}
                                className="text-white text-4xl"
                            >
                                ×
                            </button>

                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleUpdate}
                            className="grid md:grid-cols-2 gap-6"
                        >

                            {/* IMAGE */}
                            <div className="md:col-span-2 flex items-center gap-6">

                                <img
                                    src={
                                        image
                                            ? URL.createObjectURL(image)
                                            : hero?.profileImage
                                    }
                                    alt=""
                                    className="w-28 h-28 rounded-full object-cover border-4 border-cyan-400"
                                />

                                <div className="flex-1">

                                    <label className="block text-white mb-3">
                                        Upload New Image
                                    </label>

                                    <input
                                        type="file"
                                        onChange={handleImage}
                                        className="bg-slate-800 p-4 rounded-xl text-white w-full"
                                    />

                                </div>

                            </div>

                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={form.name}
                                onChange={handleChange}
                                className="bg-slate-800 p-4 rounded-xl text-white outline-none"
                            />

                            <input
                                type="text"
                                name="subtitle"
                                placeholder="Subtitle"
                                value={form.subtitle}
                                onChange={handleChange}
                                className="bg-slate-800 p-4 rounded-xl text-white outline-none"
                            />

                            <input
                                type="text"
                                name="frontendTitle"
                                placeholder="Frontend Title"
                                value={form.frontendTitle}
                                onChange={handleChange}
                                className="bg-slate-800 p-4 rounded-xl text-white outline-none"
                            />

                            <input
                                type="text"
                                name="backendTitle"
                                placeholder="Backend Title"
                                value={form.backendTitle}
                                onChange={handleChange}
                                className="bg-slate-800 p-4 rounded-xl text-white outline-none"
                            />

                            <input
                                type="text"
                                name="github"
                                placeholder="GitHub Link"
                                value={form.github}
                                onChange={handleChange}
                                className="bg-slate-800 p-4 rounded-xl text-white outline-none"
                            />

                            <input
                                type="text"
                                name="linkedin"
                                placeholder="LinkedIn Link"
                                value={form.linkedin}
                                onChange={handleChange}
                                className="bg-slate-800 p-4 rounded-xl text-white outline-none"
                            />

                            <input
                                type="text"
                                name="instagram"
                                placeholder="Instagram Link"
                                value={form.instagram}
                                onChange={handleChange}
                                className="bg-slate-800 p-4 rounded-xl text-white outline-none md:col-span-2"
                            />

                            <textarea
                                name="description"
                                placeholder="Description"
                                value={form.description}
                                onChange={handleChange}
                                className="bg-slate-800 p-4 rounded-xl text-white outline-none md:col-span-2 h-36"
                            ></textarea>

                            <button
                                className="bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl font-bold text-white md:col-span-2 transition"
                            >
                                Update Hero
                            </button>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ManageHero;