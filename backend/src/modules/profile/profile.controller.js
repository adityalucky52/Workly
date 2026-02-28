import { Admin } from "../admin/admin.model.js";
import { Manager } from "../manager/manager.model.js";
import { User } from "../user/user.model.js";
import bcrypt from "bcryptjs";

// Get current user profile
export const getProfile = async (req, res, next) => {
  try {
    const { id, role } = req.user;

    let user;
    if (role === "admin") {
      user = await Admin.findById(id).select("-password");
    } else if (role === "manager") {
      user = await Manager.findById(id)
        .select("-password")
        .populate("teamMembers", "firstName lastName");
    } else {
      user = await User.findById(id)
        .select("-password")
        .populate("manager", "firstName lastName email");
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: { ...user.toObject(), role },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    next({ status: 500, message: "Failed to fetch profile" });
  }
};

// Update profile
export const updateProfile = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const { firstName, lastName, phone, avatar } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    let user;
    if (role === "admin") {
      user = await Admin.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-password");
    } else if (role === "manager") {
      user = await Manager.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-password");
    } else {
      user = await User.findByIdAndUpdate(id, updateData, { new: true }).select(
        "-password",
      );
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { ...user.toObject(), role },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    next({ status: 400, message: error.message || "Failed to update profile" });
  }
};

// Change password
export const changePassword = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    let user;
    if (role === "admin") {
      user = await Admin.findById(id);
    } else if (role === "manager") {
      user = await Manager.findById(id);
    } else {
      user = await User.findById(id);
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    next({
      status: 400,
      message: error.message || "Failed to change password",
    });
  }
};

// Get settings (placeholder for user preferences)
export const getSettings = async (req, res, next) => {
  try {
    const { id, role } = req.user;

    // For now, return empty settings - can be expanded later
    res.status(200).json({
      success: true,
      data: {
        notifications: {
          email: true,
          push: true,
          taskReminders: true,
        },
        preferences: {
          theme: "dark",
          language: "en",
        },
      },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    next({ status: 500, message: "Failed to fetch settings" });
  }
};

// Update settings
export const updateSettings = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const { notifications, preferences } = req.body;

    // For now, just return success - settings can be stored in DB later
    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: { notifications, preferences },
    });
  } catch (error) {
    console.error("Update settings error:", error);
    next({
      status: 400,
      message: error.message || "Failed to update settings",
    });
  }
};
