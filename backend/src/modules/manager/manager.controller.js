import { Manager } from "./manager.model.js";
import { User } from "../user/user.model.js";
import { Task } from "../task/task.model.js";
import { Comment } from "../comment/comment.model.js";

// ==================== DASHBOARD ====================

export const getDashboardStats = async (req, res, next) => {
  try {
    const managerId = req.user.id;

    // Get team members
    const manager = await Manager.findById(managerId).populate("teamMembers");
    const teamMemberIds = manager?.teamMembers?.map((m) => m._id) || [];

    // Task stats
    const [
      totalTasks,
      pendingTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
    ] = await Promise.all([
      Task.countDocuments({ createdBy: managerId }),
      Task.countDocuments({ createdBy: managerId, status: "pending" }),
      Task.countDocuments({ createdBy: managerId, status: "completed" }),
      Task.countDocuments({ createdBy: managerId, status: "in-progress" }),
      Task.countDocuments({
        createdBy: managerId,
        dueDate: { $lt: new Date() },
        status: { $nin: ["completed", "cancelled"] },
      }),
    ]);

    // Team task stats
    const teamTaskStats = await Task.aggregate([
      { $match: { assignee: { $in: teamMemberIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Recent tasks
    const recentTasks = await Task.find({ createdBy: managerId })
      .populate("assignee", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        team: {
          size: teamMemberIds.length,
          members: manager?.teamMembers?.slice(0, 5) || [],
        },
        tasks: {
          total: totalTasks,
          pending: pendingTasks,
          completed: completedTasks,
          inProgress: inProgressTasks,
          overdue: overdueTasks,
        },
        teamTaskStats,
        recentTasks,
      },
    });
  } catch (error) {
    console.error("Manager dashboard error:", error);
    next({ status: 500, message: "Failed to fetch dashboard stats" });
  }
};

// ==================== TEAM MANAGEMENT ====================

export const getTeamMembers = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const { page = 1, limit = 10, search, status } = req.query;

    const manager = await Manager.findById(managerId);
    if (!manager) {
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    }

    const query = { manager: managerId };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const teamMembers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: teamMembers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get team members error:", error);
    next({ status: 500, message: "Failed to fetch team members" });
  }
};

export const getTeamMemberById = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const employeeId = req.params.id;

    const employee = await User.findOne({
      _id: employeeId,
      manager: managerId,
    }).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found or not in your team",
      });
    }

    // Get employee's tasks
    const taskStats = await Task.aggregate([
      { $match: { assignee: employee._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const recentTasks = await Task.find({ assignee: employee._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        ...employee.toObject(),
        taskStats,
        recentTasks,
      },
    });
  } catch (error) {
    console.error("Get team member error:", error);
    next({ status: 500, message: "Failed to fetch team member" });
  }
};

export const getTeamWorkload = async (req, res, next) => {
  try {
    const managerId = req.user.id;

    const manager = await Manager.findById(managerId);
    const teamMemberIds = manager?.teamMembers || [];

    // Get workload per team member
    const workload = await Task.aggregate([
      {
        $match: {
          assignee: { $in: teamMemberIds },
          status: { $nin: ["completed", "cancelled"] },
        },
      },
      {
        $group: {
          _id: "$assignee",
          activeTasks: { $sum: 1 },
          highPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
          },
          urgent: {
            $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $project: {
          _id: 1,
          activeTasks: 1,
          highPriority: 1,
          urgent: 1,
          employeeName: {
            $concat: ["$employee.firstName", " ", "$employee.lastName"],
          },
          email: "$employee.email",
        },
      },
      { $sort: { activeTasks: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: workload,
    });
  } catch (error) {
    console.error("Get team workload error:", error);
    next({ status: 500, message: "Failed to fetch team workload" });
  }
};

// ==================== TASK MANAGEMENT ====================

export const createTask = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const {
      title,
      description,
      priority,
      assigneeId,
      dueDate,
      startDate,
      category,
      estimatedHours,
      tags,
    } = req.body;

    const manager = await Manager.findById(managerId);
    if (!manager) {
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    }

    // Validate assignee is in team (if provided)
    if (assigneeId) {
      const isTeamMember = await User.findOne({
        _id: assigneeId,
        manager: managerId,
      });
      if (!isTeamMember) {
        return res.status(400).json({
          success: false,
          message: "Assignee must be in your team",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "medium",
      status: "pending",
      assignee: assigneeId || null,
      createdBy: managerId,
      dueDate: dueDate ? new Date(dueDate) : null,
      startDate: startDate ? new Date(startDate) : null,
      category: category || "other",
      estimatedHours: estimatedHours || 0,
      tags: tags || [],
    });

    // Update employee's task count if assigned
    if (assigneeId) {
      await User.findByIdAndUpdate(assigneeId, { $inc: { totalTasks: 1 } });
    }

    const populatedTask = await Task.findById(task._id)
      .populate("assignee", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: populatedTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
    next({ status: 400, message: error.message || "Failed to create task" });
  }
};

export const getMyTasks = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const { page = 1, limit = 10, status, priority, search } = req.query;

    const query = { assignee: managerId };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query)
      .populate("assignee", "firstName lastName email")
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

export const getAssignedTasks = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const { page = 1, limit = 10, status, assigneeId } = req.query;

    const manager = await Manager.findById(managerId);
    const teamMemberIds = manager?.teamMembers || [];

    const query = { assignee: { $in: teamMemberIds } };
    if (status) query.status = status;
    if (assigneeId) query.assignee = assigneeId;

    const tasks = await Task.find(query)
      .populate("assignee", "firstName lastName email")
      .populate("createdBy", "firstName lastName")
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
    console.error("Get assigned tasks error:", error);
    next({ status: 500, message: "Failed to fetch assigned tasks" });
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findOne({ _id: taskId, createdBy: managerId })
      .populate("assignee", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");

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

export const updateTask = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const taskId = req.params.id;
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: managerId },
      updates,
      { new: true, runValidators: true },
    )
      .populate("assignee", "firstName lastName email")
      .populate("createdBy", "firstName lastName");

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    next({ status: 400, message: error.message || "Failed to update task" });
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      createdBy: managerId,
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Delete associated comments
    await Comment.deleteMany({ task: taskId });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    next({ status: 500, message: "Failed to delete task" });
  }
};

// ==================== REPORTS ====================

export const getTeamPerformance = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const manager = await Manager.findById(managerId);
    const teamMemberIds = manager?.teamMembers || [];

    // Performance by team member
    const performance = await Task.aggregate([
      { $match: { assignee: { $in: teamMemberIds } } },
      {
        $group: {
          _id: "$assignee",
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $project: {
          _id: 1,
          total: 1,
          completed: 1,
          inProgress: 1,
          pending: 1,
          completionRate: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $multiply: [{ $divide: ["$completed", "$total"] }, 100] },
            ],
          },
          employeeName: {
            $concat: ["$employee.firstName", " ", "$employee.lastName"],
          },
          email: "$employee.email",
        },
      },
      { $sort: { completionRate: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: performance,
    });
  } catch (error) {
    console.error("Team performance error:", error);
    next({ status: 500, message: "Failed to fetch team performance" });
  }
};

export const getTaskCompletion = async (req, res, next) => {
  try {
    const managerId = req.user.id;

    // Monthly completion trend
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const completionTrend = await Task.aggregate([
      {
        $match: {
          createdBy: managerId,
          status: "completed",
          completedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$completedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Completion by priority
    const completionByPriority = await Task.aggregate([
      { $match: { createdBy: managerId } },
      {
        $group: {
          _id: "$priority",
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
    ]);

    // Average completion time
    const avgCompletionTime = await Task.aggregate([
      {
        $match: {
          createdBy: managerId,
          status: "completed",
          completedAt: { $ne: null },
        },
      },
      {
        $project: {
          completionDays: {
            $divide: [
              { $subtract: ["$completedAt", "$createdAt"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgDays: { $avg: "$completionDays" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        completionTrend,
        completionByPriority,
        avgCompletionDays: avgCompletionTime[0]?.avgDays?.toFixed(1) || 0,
      },
    });
  } catch (error) {
    console.error("Task completion error:", error);
    next({ status: 500, message: "Failed to fetch task completion" });
  }
};
