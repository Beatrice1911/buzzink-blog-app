const User = require("../models/User");

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
        const { name, bio } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.name = name || user.name;
        user.bio = bio || user.bio;
        
        if (req.file) {
            user.profilePhoto = `/uploads/${req.file.filename}`;
        } else if (req.body.profilePhoto === null) {
            user.profilePhoto = null;
        }

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update user profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getUserProfile,
    getCurrentUser,
    updateUserProfile
}