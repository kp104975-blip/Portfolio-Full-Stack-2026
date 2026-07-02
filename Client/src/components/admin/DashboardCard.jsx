import React from 'react'

function DashboardCard({ title, value, icon }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:scale-105 transition text-white shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-300">{title}</h3>
                <span className="text-4xl text-cyan-400">{icon}</span>
            </div>
            <h2 className="text-4xl font-bold">{value}</h2>
        </div>
    )
}

export default DashboardCard