import React from 'react'
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaGithub,
    FaYoutube,
    FaArrowUp
} from 'react-icons/fa'

function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 text-white pt-20 pb-8 relative">

            {/* Back To Top Button */}
            <a
                href="#home"
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-full shadow-lg hover:scale-110 transition duration-300"
            >
                <FaArrowUp className="text-white text-xl" />
            </a>

            <div className="max-w-7xl mx-auto px-6">

                {/* Main Footer Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

                    {/* Brand Section */}
                    <div>
                        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text mb-4">
                            MyPortfolio
                        </h2>

                        <p className="text-slate-400 leading-relaxed mb-6">
                            Passionate MERN Stack Developer focused on creating responsive,
                            scalable, and modern web applications for real-world businesses.
                        </p>

                        <div className="flex gap-4">
                            <a href="#" className="p-3 rounded-full bg-slate-800 hover:bg-cyan-500 transition duration-300">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="p-3 rounded-full bg-slate-800 hover:bg-cyan-500 transition duration-300">
                                <FaInstagram />
                            </a>
                            <a href="#" className="p-3 rounded-full bg-slate-800 hover:bg-cyan-500 transition duration-300">
                                <FaLinkedinIn />
                            </a>
                            <a href="#" className="p-3 rounded-full bg-slate-800 hover:bg-cyan-500 transition duration-300">
                                <FaGithub />
                            </a>
                            <a href="#" className="p-3 rounded-full bg-slate-800 hover:bg-cyan-500 transition duration-300">
                                <FaYoutube />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-5">Quick Links</h3>
                        <ul className="space-y-3 text-slate-400">
                            <li><a href="#home" className="hover:text-cyan-400 transition">Home</a></li>
                            <li><a href="#about" className="hover:text-cyan-400 transition">About Me</a></li>
                            <li><a href="#skills" className="hover:text-cyan-400 transition">Skills</a></li>
                            <li><a href="#projects" className="hover:text-cyan-400 transition">Projects</a></li>
                            <li><a href="#contact" className="hover:text-cyan-400 transition">Contact</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-xl font-bold mb-5">Services</h3>
                        <ul className="space-y-3 text-slate-400">
                            <li>Portfolio Website Design</li>
                            <li>MERN Stack Development</li>
                            <li>REST API Development</li>
                            <li>Responsive UI/UX Design</li>
                            <li>Freelance Web Projects</li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h3 className="text-xl font-bold mb-5">Contact Info</h3>
                        <ul className="space-y-4 text-slate-400">
                            <li>📧 manthansinghtomar2@gmail.com</li>
                            <li>📞 +91 62325 28855</li>
                            <li>📍 Gwalior (M.P) India</li>
                            <li>💼 Available for internships & freelance work</li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">

                    <p className="mb-4 md:mb-0 text-center md:text-left">
                        © 2026 MyPortfolio. All Rights Reserved.
                    </p>

                    <p className="text-center md:text-right">
                        Built with React.js, Tailwind CSS & MERN Stack
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer