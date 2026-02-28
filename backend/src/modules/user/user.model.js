import mongoose from "mongoose";

// User Schema - For regular employees
const userSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    avatar: {
      type: String,
      default: "",
    },

    // Role
    role: {
      type: String,
      enum: ["employee"],
      default: "employee",
    },

    // Manager Reference (employees report to managers)
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
      default: null,
    },

    // Account Status
    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Pending",
    },

    // Task Statistics (for tracking purposes)
    completedTasks: {
      type: Number,
      default: 0,
    },
    totalTasks: {
      type: Number,
      default: 0,
    },

    // Login tracking
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Virtual for full name

export const User = mongoose.model("User", userSchema);
