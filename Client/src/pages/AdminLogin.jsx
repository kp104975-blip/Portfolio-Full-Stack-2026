import React, { useState } from 'react'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminLogin() {

    const navigate = useNavigate()

    const { getProfile } = useAuth()

    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    // INPUT HANDLE
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // LOGIN SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            setLoading(true)

            const res = await API.post(
                '/admin/login',
                form,
                {
                    withCredentials: true
                }
            )

            // Cookie set ho jayegi backend se
            // Ab profile fetch karo

            await getProfile()

            alert(res.data.message)

            navigate('/admin/dashboard')

        } catch (error) {

            console.log(error)

            alert(
                error.response?.data?.message ||
                'Login Failed'
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl"
            >

                {/* Heading */}
                <div className="text-center mb-8">

                    <h2 className="text-4xl font-bold text-white mb-2">
                        Admin Login
                    </h2>

                    <p className="text-slate-400">
                        Login to access dashboard
                    </p>

                </div>

                {/* Email */}
                <div className="mb-5">

                    <label className="block text-slate-300 mb-2">
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full p-4 rounded-2xl bg-slate-800 text-white outline-none border border-slate-700 focus:border-cyan-400"
                    />

                </div>

                {/* Password */}
                <div className="mb-6">

                    <label className="block text-slate-300 mb-2">
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full p-4 rounded-2xl bg-slate-800 text-white outline-none border border-slate-700 focus:border-cyan-400"
                    />

                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] transition py-4 rounded-2xl text-white font-semibold disabled:opacity-50"
                >
                    {
                        loading
                            ? 'Logging in...'
                            : 'Login'
                    }
                </button>

            </form>

        </div>
    )
}

export default AdminLogin