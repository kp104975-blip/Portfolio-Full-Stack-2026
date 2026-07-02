import React from 'react'
import { FaBars, FaBell, FaSearch } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

function Navbar({ setSidebarOpen }) {

    const { admin } = useAuth()

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-72 h-20 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

            {/* Left */}
            <div className="flex items-center gap-4">

                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden bg-slate-800 p-3 rounded-xl"
                >
                    <FaBars size={20} />
                </button>

                <h2 className="text-xl md:text-2xl font-bold text-white">
                    Admin Dashboard
                </h2>

            </div>

            {/* Right */}
            <div className="flex items-center gap-3 sm:gap-5">

                {/* Search */}
                <div className="hidden md:flex items-center bg-slate-800 px-4 py-2 rounded-2xl">
                    <FaSearch className="text-slate-400 mr-2" />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none text-white"
                    />
                </div>

                {/* Notification */}
                <button className="relative bg-slate-800 p-3 rounded-xl">
                    <FaBell className="text-white" />

                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Admin Info */}
                <div className="flex items-center gap-3">

                    <div className="hidden sm:block text-right">

                        <h4 className="text-white font-semibold">
                            {admin?.name || 'Admin'}
                        </h4>

                        <p className="text-slate-400 text-sm">
                            {admin?.email}
                        </p>

                    </div>

                    {/* Profile Image */}
                    <img
                        src={
                            admin?.image ||
                            "https://i.pravatar.cc/150?img=12"
                        }
                        alt="Admin"
                        className="w-11 h-11 rounded-full border-2 border-cyan-400 object-cover"
                    />

                </div>

            </div>

        </header>
    )
}

export default Navbar