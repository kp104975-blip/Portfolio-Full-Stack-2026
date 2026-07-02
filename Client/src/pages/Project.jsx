import React from 'react'
import { useEffect, useState } from 'react'
import API from '../services/api'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

function Project() {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
        const res = await API.get('/getAllProjects');
        // The backend returns { message: "...", projects: [...] }
        setProjectData(res.data.projects || []);
        setLoading(false);
    } catch(error) {
        console.error("Error fetching projects:", error);
        setProjectData([]);
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-950 text-white text-2xl">Loading Projects...</div>
        )
    }

  return (
    <>
      <section id="projects" className="py-28 px-6 bg-slate-900">
                    <div className="max-w-7xl mx-auto">

                        <div className="text-center mb-20">
                            <p className="text-cyan-400 uppercase tracking-widest font-semibold">
                                Portfolio
                            </p>

                            <h2 className="text-5xl font-bold mt-4">
                                My Recent Work
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {Array.isArray(projectData) && projectData.length > 0 ? (
                                projectData.map((project, index) => (
                                    <div
                                        key={index}
                                        className="bg-slate-950 border border-slate-800 rounded-3xl p-8 hover:scale-105 transition duration-300 shadow-xl flex flex-col justify-between"
                                    >
                                        <div>
                                            {project.image && (
                                                <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 border border-slate-800 bg-slate-900">
                                                    <img
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover hover:scale-110 transition duration-500"
                                                    />
                                                </div>
                                            )}

                                            <div className="h-2 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-6"></div>

                                            <h3 className="text-2xl font-bold mb-4 text-white">
                                                {project.title}
                                            </h3>

                                            <p className="text-slate-400 mb-6 line-clamp-3">
                                                {project.description}
                                            </p>

                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {project.technologies.map((tech, techIndex) => (
                                                        <span
                                                            key={techIndex}
                                                            className="text-xs font-medium bg-slate-900 border border-slate-800 text-cyan-400 px-3 py-1 rounded-full"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 mt-4 border-t border-slate-900 pt-6">
                                            {project.githubLink && (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-slate-400 hover:text-white transition font-semibold"
                                                >
                                                    <FaGithub size={20} /> GitHub
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a
                                                    href={project.liveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition font-semibold"
                                                >
                                                    Live Demo <FaExternalLinkAlt size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 bg-slate-950 rounded-3xl border border-slate-800">
                                    <p className="text-slate-400 text-xl font-medium">No projects available yet.</p>
                                    <p className="text-slate-600 text-sm mt-2">Check back later or add projects from the Admin dashboard!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
    </>
  )
}

export default Project