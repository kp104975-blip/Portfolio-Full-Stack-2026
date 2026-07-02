import React from 'react'
import { useEffect, useState } from 'react'
import API from '../services/api'
import {
    FaCode,
    FaServer,
    FaLaptopCode,
    FaAward
} from 'react-icons/fa'

function Services() {
    const [serviceData, setServiceData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const response = await API.get("/services")
                console.log(response.data)
                setServiceData(response.data.service)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching service data:", error)
                setError("Failed to fetch service data.")
                setLoading(false)
            }
        };
        fetchServiceData();
    }, [])
    console.log(serviceData)

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-950 text-white text-2xl">Loading Services Section...</div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-950 text-red-500 text-2xl">{error}</div>
        )
    }

    return (
        <>
            <section className="py-28 px-6 bg-slate-950 text-white">
                <div className="max-w-7xl mx-auto text-center mb-20">
                    <p className="text-cyan-400 uppercase tracking-widest font-semibold">
                        {serviceData?.title || "My Services"}
                    </p>

                    <h2 className="text-5xl font-bold mt-4">
                        {serviceData?.description || "What I Do"}
                    </h2>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {serviceData?.headTitle && serviceData.headTitle.length > 0 ? (
                        serviceData.headTitle.map((title, index) => {
                            // Define icons list
                            const icons = [<FaCode />, <FaServer />, <FaLaptopCode />, <FaAward />];
                            const icon = icons[index % icons.length];
                            const desc = serviceData?.headDescription?.[index] || "";

                            return (
                                <div
                                    key={index}
                                    className="bg-slate-900 border border-slate-800 rounded-3xl p-10 hover:scale-105 transition"
                                >
                                    <div className="text-cyan-400 text-5xl mb-6">
                                        {icon}
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4">
                                        {title}
                                    </h3>

                                    <p className="text-slate-400">
                                        {desc}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-3 text-center text-slate-400 text-lg">No services available</div>
                    )}
                </div>
            </section>
        </>
    )
}

export default Services