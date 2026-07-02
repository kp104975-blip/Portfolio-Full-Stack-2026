import React from 'react'
import {
    FaTachometerAlt,
    FaUser,
    FaInfoCircle,
    FaServicestack,
    FaProjectDiagram,
    FaEnvelope,
    FaCog,
    FaSignOutAlt,
    FaTimes
} from 'react-icons/fa'
import { NavLink, useNavigate } from 'react-router-dom'
import API from '../../services/api'

function Sidebar({ sidebarOpen, setSidebarOpen }) {

    const navigate = useNavigate()

    const handleLogout = async () => {
        try {

            const res = await API.get('/logout', {
                withCredentials: true
            })

            alert(res.data.message)

            navigate('/admin/login')

        } catch (error) {
            console.log(error)

            alert(
                error.response?.data?.message ||
                'Logout Failed'
            )
        }
    }

    const menuItems = [
        { icon: <FaTachometerAlt />, name: 'Dashboard', path: '/admin/dashboard' },
        { icon: <FaUser />, name: 'Manage Hero', path: '/admin/hero' },
        { icon: <FaInfoCircle />, name: 'Manage About', path: '/admin/about' },
        { icon: <FaServicestack />, name: 'Manage Services', path: '/admin/services' },
        { icon: <FaProjectDiagram />, name: 'Manage Projects', path: '/admin/projects' },
        { icon: <FaEnvelope />, name: 'Contact Messages', path: '/admin/contact' },
        { icon: <FaCog />, name: 'Settings', path: '/admin/settings' }
    ]

    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full w-72
                    bg-slate-950 border-r border-slate-800
                    p-6 flex flex-col justify-between
                    transform transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                <div>
                    <div className="flex justify-between items-center lg:hidden mb-6">
                        <h1 className="text-2xl font-bold text-cyan-400">
                            Admin
                        </h1>

                        <button onClick={() => setSidebarOpen(false)}>
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <h1 className="hidden lg:block text-3xl font-extrabold mb-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text text-center">
                        Admin Panel
                    </h1>

                    <ul className="space-y-3">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 p-4 rounded-2xl transition
                                        ${isActive
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                            : 'hover:bg-slate-800 text-slate-300'
                                        }`
                                    }
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 py-4 rounded-2xl font-semibold transition"
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>

                    <p className="text-center text-slate-500 text-sm mt-4">
                        © 2026 Portfolio CMS
                    </p>
                </div>
            </aside>
        </>
    )
}

export default Sidebar