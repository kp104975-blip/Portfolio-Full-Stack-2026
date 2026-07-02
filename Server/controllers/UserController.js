// controller for user
const User = require('../models/user')
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class UserController {
    // create user
    static RegisterUser = async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({
                    message: "Name is required",
                })
            }
            if (!req.files || !req.files.image) {
                return res.status(400).json({
                    message: "Image is required",
                })
            }
            const userImage = req.files.image;
            // console.log(projectImage);

            const uploadResult = await cloudinary.uploader.upload(userImage.tempFilePath, {
                folder: "users",
            });
            // console.log(uploadResult);

            fs.unlinkSync(userImage.tempFilePath);

            const result = await User.create({
                name,
                image: uploadResult.secure_url
            });

            res.status(200).json({
                success: true,
                message: "User created successfully",
                data: result
            })

        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // login user
    static LoginUser = async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({
                    message: "All fields are required",
                })
            }
            const user = await User.findOne({ name });
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                })
            }
            res.status(200).json({
                message: "User logged in successfully",
                user,
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // getallusers
    static getAllUsers = async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json({
                message: "Users fetched successfully",
                users,
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // getSingleUser
    static getSingleUser = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                })
            }
            res.status(200).json({
                message: "User fetched successfully",
                user,
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // logout user
    static LogoutUser = async (req, res) => {
        try {
            res.clearCookie("token");
            res.status(200).json({
                message: "User logged out successfully",
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // update user
    static UpdateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                })
            }
            if (!name) {
                return res.status(400).json({
                    message: "Name is required",
                })
            }
            if (req.files && req.files.image) {
                await cloudinary.uploader.destroy(user.public_id);
                const userImage = req.files.image;
                const uploadResult = await cloudinary.uploader.upload(userImage.tempFilePath, {
                    folder: "users",
                });
                fs.unlinkSync(userImage.tempFilePath);
                user.image = uploadResult.secure_url;
                user.public_id = uploadResult.public_id;
            }
            user.name = name;
            await user.save();
            res.status(200).json({
                message: "User updated successfully",
                user,
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // delete user
    static DeleteUser = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                })
            }
            await cloudinary.uploader.destroy(user.public_id);
            await user.deleteOne();
            res.status(200).json({
                message: "User deleted successfully",
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}

module.exports = UserController;