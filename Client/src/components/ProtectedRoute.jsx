import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {

    const { admin, loading } = useAuth()

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading...
            </div>
        )
    }

    // Agar login nahi hai
    if (!admin) {
        return <Navigate to="/admin/login" />
    }

    return children
}

export default ProtectedRoute