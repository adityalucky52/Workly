import mongoose from "mongoose";

// Manager Schema - For managers who oversee employees
const managerSchema = new mongoose.Schema(
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
      enum: ["manager"],
      default: "manager",
    },

    // Account Status
    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Pending",
    },

    // Team Members (employees reporting to this manager)
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Team Statistics
    teamSize: {
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

// Ensure virtuals are included in JSON output
managerSchema.set("toJSON", { virtuals: true });
managerSchema.set("toObject", { virtuals: true });

export const Manager = mongoose.model("Manager", managerSchema);
