import { useState, useEffect } from 'react'
import API from '../services/api'
import { FaAward } from 'react-icons/fa'

function About() {

    const [aboutData, setAboutData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await API.get("/about");
                console.log(response.data);
                setAboutData(response.data.about);
                setLoading(false);
            } catch (err) {
                console.error("डेटा लोड करने में एरर आया:", err);
                setError("डेटा लोड करने में असमर्थ।");
                setLoading(false);
            }
        };
        fetchAboutData();
    }, []);
    console.log(aboutData)

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-950 text-white text-2xl">Loading About Section...</div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-950 text-red-500 text-2xl">{error}</div>
        )
    }

    return (
        <>

            {/* About Section */}
            <section id="about" className="py-28 px-6 bg-slate-900">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    <div>
                        <h2 className="text-5xl font-bold mb-8">
                            {aboutData?.title || "About Me"}
                        </h2>

                        <p className="text-slate-300 text-lg leading-relaxed mb-8">
                            {aboutData?.description || "Passionate about developing production-level applications..."}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {aboutData?.achievements?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 bg-slate-800 p-4 rounded-2xl"
                                >
                                    <FaAward className="text-cyan-400" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-3xl font-bold mb-8">
                            Technical Skills
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {aboutData?.skills?.map((skill, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-center hover:border-cyan-400 hover:scale-105 transition"
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default About