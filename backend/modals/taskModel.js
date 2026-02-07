import mongoose from "mongoose";

// Task Schema
const taskSchema = new mongoose.Schema(
  {
    // Task Information
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    // Priority & Status
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "review", "completed", "cancelled"],
      default: "pending",
    },

    // Assignment
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: function () {
        return this.assigneeType === "manager" ? "Manager" : "User";
      },
      default: null,
    },
    assigneeType: {
      type: String,
      enum: ["employee", "manager"],
      default: "employee",
    },

    // Creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: function () {
        return this.createdByType === "Admin" ? "Admin" : "Manager";
      },
      required: true,
    },
    createdByType: {
      type: String,
      enum: ["Manager", "Admin"],
      default: "Manager",
    },

    // Dates
    dueDate: {
      type: Date,
      default: null,
    },
    startDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },

    // Task Category/Type
    category: {
      type: String,
      enum: [
        "feature",
        "bug",
        "improvement",
        "documentation",
        "research",
        "other",
      ],
      default: "other",
    },

    // Estimated time (in hours)
    estimatedHours: {
      type: Number,
      default: 0,
    },
    actualHours: {
      type: Number,
      default: 0,
    },

    // Tags for filtering
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Comments count (denormalized for performance)
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Index for faster queries
taskSchema.index({ assignee: 1, status: 1 });
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ dueDate: 1 });

// Virtual for checking if task is overdue
taskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate) return false;
  if (this.status === "completed" || this.status === "cancelled") return false;
  return new Date() > this.dueDate;
});

// Virtual for days until due
taskSchema.virtual("daysUntilDue").get(function () {
  if (!this.dueDate) return null;
  const diff = this.dueDate - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Ensure virtuals are included in JSON output
taskSchema.set("toJSON", { virtuals: true });
taskSchema.set("toObject", { virtuals: true });

export const Task = mongoose.model("Task", taskSchema);
