// controller for projects
const Project = require("../models/project");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class ProjectController {
    static createProject = async (req, res) => {
        try {
            const { title, description, liveLink, githubLink, technologies } = req.body;
            if (!title || !description || !liveLink || !githubLink || !technologies) {
                return res.status(400).json({
                    message: "All fields are required",
                })
            }
            if (!req.files || !req.files.image) {
                return res.status(400).json({
                    message: "Project image is required",
                })
            }
            const projectImage = req.files.image;

            const uploadResult = await cloudinary.uploader.upload(projectImage.tempFilePath, {
                folder: "projects",
            });

            fs.unlinkSync(projectImage.tempFilePath);

            let techArray = technologies;
            if (typeof technologies === 'string') {
                techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
            } else if (Array.isArray(technologies) && technologies.length === 1 && technologies[0].includes(',')) {
                techArray = technologies[0].split(',').map(t => t.trim()).filter(Boolean);
            }

            const result = await Project.create({
                title,
                description,
                liveLink,
                githubLink,
                technologies: techArray,
                image: uploadResult.secure_url
            });

            res.status(200).json({
                success: true,
                message: "Project created successfully",
                data: result
            })

        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // all projects
    static getAllProjects = async (req, res) => {
        try {
            const projects = await Project.find();
            res.status(200).json({
                message: "Projects fetched successfully",
                projects,
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // single project
    static getSingleProject = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await Project.findById(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found",
                })
            }
            res.status(200).json({
                message: "Project fetched successfully",
                project,
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // update project
    static updateProject = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, liveLink, githubLink, technologies } = req.body;
            const project = await Project.findById(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found",
                })
            }
            // if user send image old image delete
            if (req.files && req.files.image) {
                if (project.public_id) {
                    await cloudinary.uploader.destroy(project.public_id);
                } else if (project.image) {
                    // Try destroying using the image URL if public_id is not saved
                    const urlParts = project.image.split('/');
                    const fileWithExt = urlParts[urlParts.length - 1];
                    const publicId = fileWithExt.split('.')[0];
                    await cloudinary.uploader.destroy(`projects/${publicId}`);
                }
                const projectImage = req.files.image;
                const uploadResult = await cloudinary.uploader.upload(projectImage.tempFilePath, {
                    folder: "projects",
                });
                fs.unlinkSync(projectImage.tempFilePath);
                project.image = uploadResult.secure_url;
                project.public_id = uploadResult.public_id;
            }

            let techArray = technologies;
            if (technologies && typeof technologies === 'string') {
                techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
            } else if (Array.isArray(technologies) && technologies.length === 1 && technologies[0].includes(',')) {
                techArray = technologies[0].split(',').map(t => t.trim()).filter(Boolean);
            }

            project.title = title || project.title;
            project.description = description || project.description;
            project.liveLink = liveLink || project.liveLink;
            project.githubLink = githubLink || project.githubLink;
            project.technologies = techArray || project.technologies;
            await project.save();
            res.status(200).json({
                message: "Project updated successfully",
                project,
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // delete project
    static deleteProject = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await Project.findById(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found",
                })
            }
            await cloudinary.uploader.destroy(project.public_id);
            await project.deleteOne();
            res.status(200).json({
                message: "Project deleted successfully",
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
module.exports = ProjectController;