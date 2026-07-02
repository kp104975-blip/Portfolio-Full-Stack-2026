import React, { useEffect, useState } from 'react';
import {
    FaProjectDiagram,
    FaServicestack,
    FaEnvelope,
    FaChartLine,
    FaEye,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';
import API from '../../services/api';

function Dashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        services: 0,
        messages: 0,
        visitors: '1,438'
    });
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState([
        'Dashboard system initialized',
        'Connected to local MongoDB database'
    ]);

    const fetchStats = async () => {
        try {
            // Fetch projects
            const projectsRes = await API.get('/getAllProjects');
            const projectsCount = projectsRes.data.projects?.length || 0;

            // Fetch services
            const servicesRes = await API.get('/services');
            const serviceDoc = servicesRes.data?.services || servicesRes.data?.service || servicesRes.data;
            const servicesCount = serviceDoc?.headTitle?.length || 0;

            // Fetch messages
            const contactsRes = await API.get('/getAllContact', { withCredentials: true });
            const messagesList = contactsRes.data.contacts || [];
            const messagesCount = messagesList.length || 0;

            setStats({
                projects: projectsCount,
                services: servicesCount,
                messages: messagesCount,
                visitors: '1,438' // Mock visitor count
            });

            // Dynamically populate recent activities based on fetched data
            const activities = [];
            if (projectsCount > 0) {
                activities.push(`Discovered ${projectsCount} active projects in your portfolio.`);
            } else {
                activities.push('No projects found yet. Try adding a new project!');
            }

            if (messagesCount > 0) {
                const latestMsg = messagesList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                activities.push(`New inquiry received from "${latestMsg.name}": "${latestMsg.subject}".`);
            } else {
                activities.push('Inquiries inbox is currently empty.');
            }

            if (servicesCount > 0) {
                activities.push(`Your profile displays ${servicesCount} specialized developer services.`);
            }

            setRecentActivities(prev => [...activities, ...prev]);

        } catch (error) {
            console.error("Error loading dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const dashboardStats = [
        {
            title: 'Total Projects',
            value: stats.projects,
            icon: <FaProjectDiagram />,
            growth: '+12%',
            positive: true
        },
        {
            title: 'Services Offered',
            value: stats.services,
            icon: <FaServicestack />,
            growth: '+25%',
            positive: true
        },
        {
            title: 'Client Inquiries',
            value: stats.messages,
            icon: <FaEnvelope />,
            growth: stats.messages > 0 ? '+15%' : '0%',
            positive: stats.messages > 0
        },
        {
            title: 'Mock Visitors',
            value: stats.visitors,
            icon: <FaEye />,
            growth: '+4%',
            positive: true
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="text-white">

            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Dashboard Overview
                </h1>
                <p className="text-slate-400 text-lg">
                    Welcome back! Here’s your portfolio system summary.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mb-14">
                {dashboardStats.map((item, index) => (
                    <div
                        key={index}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:scale-105 transition shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-slate-400 mb-2 font-medium">
                                    {item.title}
                                </p>
                                <h2 className="text-4xl font-bold">
                                    {item.value}
                                </h2>
                            </div>
                            <div className="text-5xl text-cyan-400">
                                {item.icon}
                            </div>
                        </div>

                        <div
                            className={`flex items-center gap-2 font-semibold ${item.positive
                                ? 'text-green-400'
                                : 'text-slate-400'
                                }`}
                        >
                            {item.positive ? <FaArrowUp /> : <FaArrowDown />}
                            {item.growth} this month
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8 mb-14">

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold mb-8 border-b border-slate-800 pb-3">
                        Recent Activities
                    </h2>
                    <ul className="space-y-5">
                        {recentActivities.map((activity, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-4 border-b border-slate-800 pb-4 text-slate-350"
                            >
                                <span className="w-3 h-3 bg-cyan-400 rounded-full flex-shrink-0"></span>
                                <span className="text-slate-300 font-medium">{activity}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Performance */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold mb-8 border-b border-slate-800 pb-3">
                        Performance Index
                    </h2>
                    <div className="space-y-6">
                        {/* Portfolio Growth */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-350">Portfolio Growth</span>
                                <span className="font-bold text-cyan-400">92%</span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-3">
                                <div className="bg-cyan-450 bg-cyan-400 h-3 rounded-full w-[92%]"></div>
                            </div>
                        </div>

                        {/* User Engagement */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-350">User Engagement</span>
                                <span className="font-bold text-blue-400">88%</span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-3">
                                <div className="bg-blue-500 h-3 rounded-full w-[88%]"></div>
                            </div>
                        </div>

                        {/* SEO Ranking */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-350">SEO Ranking</span>
                                <span className="font-bold text-purple-400">81%</span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-3">
                                <div className="bg-purple-500 h-3 rounded-full w-[81%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Placeholder */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">
                        Analytics Overview
                    </h2>
                    <FaChartLine className="text-cyan-400 text-4xl" />
                </div>
                <div className="h-80 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 text-xl font-medium">
                    Recharts / Graph Analytics Section
                </div>
            </div>
        </div>
    );
}

export default Dashboard;