import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import Navbar from '../components/admin/Navbar'
import Footer from '../components/admin/Footer'

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="bg-slate-950 min-h-screen text-white flex">

            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Main Content */}
            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">

                {/* Navbar */}
                <Navbar setSidebarOpen={setSidebarOpen} />

                {/* Page Content */}
                <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8 pb-10">
                    <Outlet />
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    )
}

export default AdminLayout