import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { FaUserCog, FaShieldAlt, FaKey } from 'react-icons/fa';
import defaultAvatar from '../../assets/admin_avatar.png';

function Settings() {
    const { admin, getProfile } = useAuth();

    // Profile settings states
    const [profileForm, setProfileForm] = useState({
        name: "",
        email: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Password settings states
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (admin) {
            setProfileForm({
                name: admin.name || "",
                email: admin.email || ""
            });
        }
    }, [admin]);

    // Handle Profile Input Change
    const handleProfileChange = (e) => {
        setProfileForm({
            ...profileForm,
            [e.target.name]: e.target.value
        });
    };

    // Handle Image file select
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // Update Profile Request
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", profileForm.name);
            formData.append("email", profileForm.email);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await API.put("/updateProfile", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert(res.data.message || "Profile updated successfully!");
            setImageFile(null);
            // Refresh Auth Context to sync profile changes globally
            await getProfile();
        } catch (error) {
            console.error("Profile update error:", error);
            alert(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setProfileLoading(false);
        }
    };

    // Handle Password Input Change
    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };

    // Update Password Request
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        setPasswordLoading(true);

        try {
            const res = await API.put("/changePassword", {
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword
            }, {
                withCredentials: true
            });

            alert(res.data.message || "Password changed successfully!");
            setPasswordForm({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            console.error("Password change error:", error);
            alert(error.response?.data?.message || "Failed to change password.");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="text-white min-h-screen">
            {/* Header */}
            <div className="mb-12 border-b border-slate-800 pb-6">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
                    <FaUserCog className="text-cyan-400" /> Account Settings
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Manage your administrator credentials, email visibility, profile details, and security passwords.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-start">
                
                {/* Profile Details Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
                        <FaUserCog className="text-cyan-400" size={20} /> Personal Profile
                    </h2>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        {/* Name */}
                        <div className="flex flex-col">
                            <label className="text-slate-300 font-semibold mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={profileForm.name}
                                onChange={handleProfileChange}
                                className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="text-slate-300 font-semibold mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={profileForm.email}
                                onChange={handleProfileChange}
                                className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                            />
                        </div>

                        {/* Profile Image & Upload */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                            <div className="w-20 h-20 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                <img
                                    src={
                                        imageFile
                                            ? URL.createObjectURL(imageFile)
                                            : (admin?.image && !admin.image.includes("pravatar") && !admin.image.includes("default.jpg")
                                                ? admin.image
                                                : defaultAvatar)
                                    }
                                    alt="Admin Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = defaultAvatar;
                                    }}
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="text-slate-300 font-semibold block mb-2">Profile Picture</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none w-full cursor-pointer file:bg-slate-800 file:border-none file:text-white file:px-4 file:py-2 file:rounded-xl file:mr-4 file:font-semibold hover:file:bg-slate-700 text-sm"
                                />
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={profileLoading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.01] active:scale-95 py-4 rounded-2xl text-white font-bold transition disabled:opacity-50"
                        >
                            {profileLoading ? "Updating Profile..." : "Update Profile Details"}
                        </button>
                    </form>
                </div>

                {/* Password Settings Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
                        <FaShieldAlt className="text-cyan-400" size={20} /> Security & Password
                    </h2>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        {/* Old Password */}
                        <div className="flex flex-col">
                            <label className="text-slate-300 font-semibold mb-2">Current Password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                required
                                placeholder="••••••••"
                                value={passwordForm.oldPassword}
                                onChange={handlePasswordChange}
                                className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                            />
                        </div>

                        {/* New Password */}
                        <div className="flex flex-col">
                            <label className="text-slate-300 font-semibold mb-2">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                required
                                placeholder="••••••••"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col">
                            <label className="text-slate-300 font-semibold mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                placeholder="••••••••"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:scale-[1.01] active:scale-95 py-4 rounded-2xl text-slate-950 font-bold transition disabled:opacity-50"
                        >
                            {passwordLoading ? "Updating Password..." : "Change Account Password"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Settings;