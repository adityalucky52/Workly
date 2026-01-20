import { Admin } from "../modals/adminModel.js";
import { Manager } from "../modals/managerModel.js";
import { User } from "../modals/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT token with role information
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Set cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ==================== ADMIN AUTH ====================

export const registerAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(admin._id, "admin");

    // Set cookie
    res.cookie("token", token, cookieOptions);

    // Return response without password
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: { ...adminResponse, role: "admin" },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    next({ status: 400, message: error.message || "Registration failed" });
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id, "admin");

    // Set cookie
    res.cookie("token", token, cookieOptions);

    // Return response without password
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { ...adminResponse, role: "admin" },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    next({ status: 400, message: error.message || "Login failed" });
  }
};

// ==================== MANAGER AUTH ====================

export const registerManager = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if manager already exists
    const managerExists = await Manager.findOne({ email });
    if (managerExists) {
      return res.status(400).json({
        success: false,
        message: "Manager already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create manager
    const manager = await Manager.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(manager._id, "manager");

    // Set cookie
    res.cookie("token", token, cookieOptions);

    // Return response without password
    const managerResponse = manager.toObject();
    delete managerResponse.password;

    res.status(201).json({
      success: true,
      message: "Manager registered successfully",
      user: { ...managerResponse, role: "manager" },
    });
  } catch (error) {
    console.error("Manager registration error:", error);
    next({ status: 400, message: error.message || "Registration failed" });
  }
};

export const loginManager = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find manager
    const manager = await Manager.findOne({ email });
    if (!manager) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, manager.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Update last login
    manager.lastLogin = new Date();
    await manager.save();

    // Generate token
    const token = generateToken(manager._id, "manager");

    // Set cookie
    res.cookie("token", token, cookieOptions);

    // Return response without password
    const managerResponse = manager.toObject();
    delete managerResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { ...managerResponse, role: "manager" },
    });
  } catch (error) {
    console.error("Manager login error:", error);
    next({ status: 400, message: error.message || "Login failed" });
  }
};

// ==================== EMPLOYEE AUTH ====================

export const registerEmployee = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if employee already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create employee
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user._id, "employee");

    // Set cookie
    res.cookie("token", token, cookieOptions);

    // Return response without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      user: { ...userResponse, role: "employee" },
    });
  } catch (error) {
    console.error("Employee registration error:", error);
    next({ status: 400, message: error.message || "Registration failed" });
  }
};

export const loginEmployee = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find employee
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, "employee");

    // Set cookie
    res.cookie("token", token, cookieOptions);

    // Return response without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { ...userResponse, role: "employee" },
    });
  } catch (error) {
    console.error("Employee login error:", error);
    next({ status: 400, message: error.message || "Login failed" });
  }
};

// ==================== COMMON AUTH ====================

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getCurrentUser = async (req, res, next) => {
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: { ...user.toObject(), role },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    next({ status: 400, message: error.message || "Failed to get user" });
  }
};
