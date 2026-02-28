import mongoose from "mongoose";

// Group Schema - For creating teams with managers and employees
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Manager(s) of this group
    managers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manager",
      },
    ],

    // Employees in this group
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Created by admin
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    // Status
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

// Virtual for total members count
groupSchema.virtual("totalMembers").get(function () {
  return this.managers.length + this.employees.length;
});

// Ensure virtuals are included in JSON output
groupSchema.set("toJSON", { virtuals: true });
groupSchema.set("toObject", { virtuals: true });

export const Group = mongoose.model("Group", groupSchema);
