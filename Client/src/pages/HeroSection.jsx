import React, { useEffect, useState } from 'react'
import API from '../services/api'
import { Link } from 'react-router-dom'
import {
    FaGithub,
    FaLinkedin,
    FaInstagram,
    FaServer,
    FaLaptopCode} from 'react-icons/fa'

function HeroSection() {

    const [hero, setHero] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchHero = async () => {
        try {
            const res = await API.get("/getAllHero")
            console.log(res.data.hero)
            setHero(res.data.hero)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHero()
    }, [])
    console.log(hero)

    if(loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-950 text-white text-2xl">Loading Hero Section...</div>
        )
    }
    return (
        <>
            <section
                id="home"
                className="min-h-screen flex items-center pt-28 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            >
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <div>
                        <p className="text-cyan-400 font-semibold mb-4 uppercase tracking-widest animate-pulse">
                            {hero?.subtitle || "WELCOME TO MY PORTFOLIO"}
                        </p>

                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                            Hi, I'm
                            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
                                {hero?.name || "Krishna"}
                            </span>
                        </h1>

                        <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                            {hero?.description || "I am a passionate Full Stack Developer specializing in building robust, performant, and beautifully designed web applications. Let's build something amazing together!"}
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mb-10">
                            <a
                                href="#projects"
                                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition duration-300 font-semibold shadow-lg shadow-cyan-500/20"
                            >
                                View Portfolio
                            </a>

                            <a
                                href={hero?.resumeLink || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="px-8 py-4 rounded-2xl border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition duration-300"
                            >
                                Download Resume
                            </a>

                            <Link
                                to="/admin/login"
                                className="px-8 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:border-cyan-400 transition duration-300 font-semibold"
                            >
                                Admin Login
                            </Link>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-5 text-2xl text-slate-400">
                            <a href={hero?.github || "https://github.com"} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition duration-300"><FaGithub /></a>
                            <a href={hero?.linkedin || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition duration-300"><FaLinkedin /></a>
                            <a href={hero?.instagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition duration-300"><FaInstagram /></a>
                        </div>
                    </div>

                    {/* Right Image + Floating Cards */}
                    <div className="relative flex justify-center">
                        <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                            <img
                                src={hero?.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"}
                                alt={hero?.name || "Krishna"}
                                className="rounded-3xl w-96 h-[500px] object-cover"
                            />
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute top-8 -left-8 bg-slate-900 p-4 rounded-2xl border border-slate-700 shadow-lg flex flex-col items-center">
                            <FaLaptopCode className="text-cyan-400 text-3xl mb-2 animate-bounce" />
                            <p className="font-semibold text-white">{hero?.frontendTitle || "Frontend Developer"}</p>
                        </div>

                        <div className="absolute bottom-8 -right-8 bg-slate-900 p-4 rounded-2xl border border-slate-700 shadow-lg flex flex-col items-center">
                            <FaServer className="text-cyan-400 text-3xl mb-2" />
                            <p className="font-semibold text-white">{hero?.backendTitle || "Backend Developer"}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HeroSection