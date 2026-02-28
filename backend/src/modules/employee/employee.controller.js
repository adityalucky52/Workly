import { User } from "../user/user.model.js";
import { Task } from "../task/task.model.js";
import { Comment } from "../comment/comment.model.js";
import mongoose from "mongoose";

// ==================== DASHBOARD ====================

export const getDashboardStats = async (req, res, next) => {
  try {
    const employeeId = req.user.id;

    // Get task stats
    const [
      totalTasks,
      pendingTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
    ] = await Promise.all([
      Task.countDocuments({ assignee: employeeId }),
      Task.countDocuments({ assignee: employeeId, status: "pending" }),
      Task.countDocuments({ assignee: employeeId, status: "completed" }),
      Task.countDocuments({ assignee: employeeId, status: "in-progress" }),
      Task.countDocuments({
        assignee: employeeId,
        dueDate: { $lt: new Date() },
        status: { $nin: ["completed", "cancelled"] },
      }),
    ]);

    // Get recent tasks
    const recentTasks = await Task.find({ assignee: employeeId })
      .populate("createdBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get upcoming deadlines
    const upcomingDeadlines = await Task.find({
      assignee: employeeId,
      dueDate: { $gte: new Date() },
      status: { $nin: ["completed", "cancelled"] },
    })
      .sort({ dueDate: 1 })
      .limit(5);

    // Completion rate
    const completionRate =
      totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        tasks: {
          total: totalTasks,
          pending: pendingTasks,
          completed: completedTasks,
          inProgress: inProgressTasks,
          overdue: overdueTasks,
        },
        completionRate,
        recentTasks,
        upcomingDeadlines,
      },
    });
  } catch (error) {
    console.error("Employee dashboard error:", error);
    next({ status: 500, message: "Failed to fetch dashboard stats" });
  }
};

// ==================== TASK MANAGEMENT ====================

export const getMyTasks = async (req, res, next) => {
  try {
    const employeeId = req.user.id;
    const { page = 1, limit = 10, status, priority, search } = req.query;

    const query = { assignee: employeeId };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query)
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get my tasks error:", error);
    next({ status: 500, message: "Failed to fetch tasks" });
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const employeeId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findOne({ _id: taskId, assignee: employeeId })
      .populate("createdBy", "firstName lastName email")
      .populate("assignee", "firstName lastName email");

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Get comments
    const comments = await Comment.find({ task: taskId })
      .populate("author", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { ...task.toObject(), comments },
    });
  } catch (error) {
    console.error("Get task by id error:", error);
    next({ status: 500, message: "Failed to fetch task" });
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const employeeId = req.user.id;
    const taskId = req.params.id;
    const { status, actualHours } = req.body;

    const validStatuses = ["pending", "in-progress", "review", "completed"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const updateData = { status };
    if (status === "completed") {
      updateData.completedAt = new Date();
      // Update employee's completed task count
      await User.findByIdAndUpdate(employeeId, { $inc: { completedTasks: 1 } });
    }
    if (actualHours !== undefined) {
      updateData.actualHours = actualHours;
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, assignee: employeeId },
      updateData,
      { new: true },
    ).populate("createdBy", "firstName lastName");

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task status error:", error);
    next({
      status: 400,
      message: error.message || "Failed to update task status",
    });
  }
};

// ==================== ACTIVITY ====================

export const getTaskHistory = async (req, res, next) => {
  try {
    const employeeId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    // Get completed tasks as history
    const tasks = await Task.find({
      assignee: employeeId,
      status: "completed",
    })
      .populate("createdBy", "firstName lastName")
      .sort({ completedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Task.countDocuments({
      assignee: employeeId,
      status: "completed",
    });

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get task history error:", error);
    next({ status: 500, message: "Failed to fetch task history" });
  }
};

export const getMyComments = async (req, res, next) => {
  try {
    const employeeId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({
      author: employeeId,
      authorModel: "User",
    })
      .populate("task", "title status")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments({
      author: employeeId,
      authorModel: "User",
    });

    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get my comments error:", error);
    next({ status: 500, message: "Failed to fetch comments" });
  }
};

export const addComment = async (req, res, next) => {
  try {
    const employeeId = req.user.id;
    const taskId = req.params.id;
    const { content } = req.body;

    // Verify task belongs to employee
    const task = await Task.findOne({ _id: taskId, assignee: employeeId });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const comment = await Comment.create({
      content,
      task: taskId,
      author: employeeId,
      authorModel: "User",
      authorRole: "employee",
    });

    // Update comment count
    await Task.findByIdAndUpdate(taskId, { $inc: { commentsCount: 1 } });

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "firstName lastName",
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: populatedComment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    next({ status: 400, message: error.message || "Failed to add comment" });
  }
};

export const getTaskComments = async (req, res, next) => {
  try {
    const employeeId = req.user.id;
    const taskId = req.params.id;

    // Verify task belongs to employee
    const task = await Task.findOne({ _id: taskId, assignee: employeeId });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const comments = await Comment.find({ task: taskId })
      .populate("author", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Get task comments error:", error);
    next({ status: 500, message: "Failed to fetch comments" });
  }
};
