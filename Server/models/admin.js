const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String, // Cloudinary secure_url
        required: [true, "Admin image is required"]
    },

    public_id: {
        type: String, // Cloudinary public_id

    }
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);