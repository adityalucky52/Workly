import jwt from "jsonwebtoken";
import { Admin } from "../modals/adminModel.js";
import { Manager } from "../modals/managerModel.js";
import { User } from "../modals/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // {id: "...", role: "admin|manager|employee"}

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
};

// Role-based access control middleware
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Insufficient permissions",
      });
    }
    next();
  };
};

// Verify user exists in database
export const verifyUserExists = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    let user;

    if (role === "admin") {
      user = await Admin.findById(id).select("-password");
    } else if (role === "manager") {
      user = await Manager.findById(id).select("-password");
    } else {
      user = await User.findById(id).select("-password");
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.userDoc = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
