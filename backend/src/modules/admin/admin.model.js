import mongoose from "mongoose";

// Admin Schema - Separate schema for administrators
const adminSchema = new mongoose.Schema(
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

    // Role (fixed as admin)
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },

    // Account Status
    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Active",
    },

    // Admin Permissions (for granular access control)
    permissions: {
      manageUsers: {
        type: Boolean,
        default: true,
      },
      manageManagers: {
        type: Boolean,
        default: true,
      },
      manageTasks: {
        type: Boolean,
        default: true,
      },
      viewReports: {
        type: Boolean,
        default: true,
      },
      manageSettings: {
        type: Boolean,
        default: true,
      },
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
adminSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for avatar initials
adminSchema.virtual("initials").get(function () {
  return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
});

// Ensure virtuals are included in JSON output
adminSchema.set("toJSON", { virtuals: true });
adminSchema.set("toObject", { virtuals: true });

export const Admin = mongoose.model("Admin", adminSchema);
