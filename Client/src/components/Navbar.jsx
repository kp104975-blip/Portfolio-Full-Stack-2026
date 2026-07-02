import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo */}
                <a
                    href="#home"
                    className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text tracking-wide"
                >
                    MyPortfolio
                </a>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-8 text-white font-medium">
                    <li>
                        <a href="#home" className="hover:text-cyan-400 transition duration-300">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#about" className="hover:text-cyan-400 transition duration-300">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="#skills" className="hover:text-cyan-400 transition duration-300">
                            Skills
                        </a>
                    </li>
                    <li>
                        <a href="#projects" className="hover:text-cyan-400 transition duration-300">
                            Projects
                        </a>
                    </li>
                    <li>
                        <a href="#contact" className="hover:text-cyan-400 transition duration-300">
                            Contact
                        </a>
                    </li>
                </ul>

                {/* Resume Button */}
                <div className="hidden md:block">
                    <a
                        href="/resume.pdf"
                        download
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition transform text-white font-semibold shadow-lg"
                    >
                        Resume
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={30} /> : <Menu size={30} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden bg-slate-900 border-t border-slate-800 overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 py-4' : 'max-h-0'
                }`}
            >
                <ul className="flex flex-col px-6 gap-4 text-white font-medium">
                    <li>
                        <a
                            href="#home"
                            onClick={() => setIsOpen(false)}
                            className="block hover:text-cyan-400"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="#about"
                            onClick={() => setIsOpen(false)}
                            className="block hover:text-cyan-400"
                        >
                            About
                        </a>
                    </li>
                    <li>
                        <a
                            href="#skills"
                            onClick={() => setIsOpen(false)}
                            className="block hover:text-cyan-400"
                        >
                            Skills
                        </a>
                    </li>
                    <li>
                        <a
                            href="#projects"
                            onClick={() => setIsOpen(false)}
                            className="block hover:text-cyan-400"
                        >
                            Projects
                        </a>
                    </li>
                    <li>
                        <a
                            href="#contact"
                            onClick={() => setIsOpen(false)}
                            className="block hover:text-cyan-400"
                        >
                            Contact
                        </a>
                    </li>
                </ul>

                <div className="px-6 mt-6">
                    <a
                        href="/resume.pdf"
                        download
                        className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold"
                    >
                        Download Resume
                    </a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar