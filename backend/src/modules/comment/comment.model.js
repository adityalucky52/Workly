import mongoose from "mongoose";

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    // Comment content
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },

    // Task reference
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    // Author info (polymorphic - can be admin, manager, or employee)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "authorModel",
    },
    authorModel: {
      type: String,
      required: true,
      enum: ["Admin", "Manager", "User"],
    },
    authorRole: {
      type: String,
      enum: ["admin", "manager", "employee"],
      required: true,
    },

    // Optional: mention other users
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Edit tracking
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Index for faster queries
commentSchema.index({ task: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

// Ensure virtuals are included in JSON output
commentSchema.set("toJSON", { virtuals: true });
commentSchema.set("toObject", { virtuals: true });

export const Comment = mongoose.model("Comment", commentSchema);
