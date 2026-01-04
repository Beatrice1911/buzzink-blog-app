const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ name: req.params.name }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get logged-in user's profile (for private dashboard)
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const updateUserProfile = async (req, res) => {
    try {
        const { name, bio, removePhoto } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
    
        if (user.profilePhoto && user.profilePhoto.startsWith("/uploads")) {
        user.profilePhoto = "";
        }

        user.name = name || user.name;
        user.bio = bio || user.bio;

        if (removePhoto === "true") {
            user.profilePhoto = "";
        }
        
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "buzzink_profiles"
            });
            user.profilePhoto = result.secure_url;

            if (req.file?.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update user profile error:", error);
        res.status(500).json({ 
            message: error.message,
            stack:error.stack
         });
    }
};

module.exports = {
    getUserProfile,
    getCurrentUser,
    updateUserProfile
}