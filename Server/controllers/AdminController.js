const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class AdminController {
    static register = async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ message: "Admin already exists" });
            }

            if (!req.files || !req.files.image) {
                return res.status(400).json({ message: "Image is required" });
            }
            const image = req.files.image;

            const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "admin",
            });
            fs.unlinkSync(image.tempFilePath);

            const hashPassword = await bcrypt.hash(password, 10);
            const admin = new Admin({
                name,
                email,
                password: hashPassword,
                image: uploadResult.secure_url,
                public_id: uploadResult.public_id
            });
            await admin.save();

            res.status(201).json({
                success: true,
                message: "Admin registered successfully",
                data: admin
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(400).json({ message: "Admin not found" });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
                maxAge: 60 * 60 * 1000,
                path: "/"
            });
            res.status(200).json({
                message: "Admin logged in successfully",
                token,
                id: admin._id,
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static logout = async (req, res) => {
        try {
            res.clearCookie("token");
            res.status(200).json({ message: "Admin logged out successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static getProfile = async (req, res) => {
        try {
            const admin = req.admin;
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            res.status(200).json({ message: "Admin profile", adminData: admin });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static updateProfile = async (req, res) => {
        try {
            const id = req.admin._id;
            const admin = await Admin.findById(id);
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }

            if (req.files && req.files.image) {
                if (admin.public_id) {
                    await cloudinary.uploader.destroy(admin.public_id);
                }
                const image = req.files.image;
                const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: "admin",
                });
                fs.unlinkSync(image.tempFilePath);
                admin.image = uploadResult.secure_url;
                admin.public_id = uploadResult.public_id;
            }
            admin.name = req.body.name || admin.name;
            admin.email = req.body.email || admin.email;
            await admin.save();
            res.status(200).json({ message: "Admin profile updated successfully", admin });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static changePassword = async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: "Both old and new passwords are required" });
            }
            const id = req.admin._id;
            const admin = await Admin.findById(id);
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            const isMatch = await bcrypt.compare(oldPassword, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect old password" });
            }
            const hashPassword = await bcrypt.hash(newPassword, 10);
            admin.password = hashPassword;
            await admin.save();
            res.status(200).json({ message: "Admin password changed successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}

module.exports = AdminController;
