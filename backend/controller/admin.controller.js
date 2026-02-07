import { Admin } from "../modals/adminModel.js";
import { Manager } from "../modals/managerModel.js";
import { User } from "../modals/userModel.js";
import { Task } from "../modals/taskModel.js";
import bcrypt from "bcryptjs";

// ==================== DASHBOARD ====================

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalEmployees,
      totalManagers,
      totalAdmins,
      totalTasks,
      pendingTasks,
      completedTasks,
      inProgressTasks,
    ] = await Promise.all([
      User.countDocuments(),
      Manager.countDocuments(),
      Admin.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: "pending" }),
      Task.countDocuments({ status: "completed" }),
      Task.countDocuments({ status: "in-progress" }),
    ]);

    // Get recent users
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalEmployees + totalManagers,
          employees: totalEmployees,
          managers: totalManagers,
          admins: totalAdmins,
        },
        tasks: {
          total: totalTasks,
          pending: pendingTasks,
          completed: completedTasks,
          inProgress: inProgressTasks,
        },
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    next({ status: 500, message: "Failed to fetch dashboard stats" });
  }
};

// ==================== USER MANAGEMENT ====================

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .populate("manager", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    next({ status: 500, message: "Failed to fetch users" });
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("manager", "firstName lastName email");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get user's task stats
    const taskStats = await Task.aggregate([
      { $match: { assignee: user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: { ...user.toObject(), taskStats },
    });
  } catch (error) {
    console.error("Get user by id error:", error);
    next({ status: 500, message: "Failed to fetch user" });
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    const existingManager = await Manager.findOne({ email });
    if (existingUser || existingManager) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    if (role === "manager") {
      newUser = await Manager.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        status: "Active",
      });
    } else {
      newUser = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        status: "Active",
      });
    }

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: `${role || "Employee"} created successfully`,
      data: userResponse,
    });
  } catch (error) {
    console.error("Create user error:", error);
    next({ status: 400, message: error.message || "Failed to create user" });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, status },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    next({ status: 400, message: error.message || "Failed to update user" });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Inactive" },
      { new: true },
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    next({ status: 500, message: "Failed to delete user" });
  }
};

export const assignManagerToEmployee = async (req, res, next) => {
  try {
    const { managerId } = req.body;
    const employeeId = req.params.id;

    // Validate manager exists
    const manager = await Manager.findById(managerId);
    if (!manager) {
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    }

    // Update employee's manager
    const employee = await User.findByIdAndUpdate(
      employeeId,
      { manager: managerId },
      { new: true },
    ).select("-password");

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Add employee to manager's team
    await Manager.findByIdAndUpdate(managerId, {
      $addToSet: { teamMembers: employeeId },
      $inc: { teamSize: 1 },
    });

    res.status(200).json({
      success: true,
      message: "Manager assigned successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Assign manager error:", error);
    next({ status: 500, message: "Failed to assign manager" });
  }
};

// ==================== MANAGER MANAGEMENT ====================

export const getAllManagers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const managers = await Manager.find(query)
      .select("-password")
      .populate("teamMembers", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Manager.countDocuments(query);

    res.status(200).json({
      success: true,
      data: managers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all managers error:", error);
    next({ status: 500, message: "Failed to fetch managers" });
  }
};

export const getManagerById = async (req, res, next) => {
  try {
    const manager = await Manager.findById(req.params.id)
      .select("-password")
      .populate("teamMembers", "firstName lastName email status");

    if (!manager) {
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    }

    // Get tasks created by this manager
    const taskStats = await Task.aggregate([
      { $match: { createdBy: manager._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: { ...manager.toObject(), taskStats },
    });
  } catch (error) {
    console.error("Get manager by id error:", error);
    next({ status: 500, message: "Failed to fetch manager" });
  }
};

export const updateManager = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, status } = req.body;

    const manager = await Manager.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, status },
      { new: true, runValidators: true },
    ).select("-password");

    if (!manager) {
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    }

    res.status(200).json({
      success: true,
      message: "Manager updated successfully",
      data: manager,
    });
  } catch (error) {
    console.error("Update manager error:", error);
    next({ status: 400, message: error.message || "Failed to update manager" });
  }
};

export const approveManager = async (req, res, next) => {
  try {
    console.log("=== APPROVE MANAGER REQUEST ===");
    console.log("Manager ID:", req.params.id);

    const manager = await Manager.findByIdAndUpdate(
      req.params.id,
      { status: "Active" },
      { new: true },
    ).select("-password");

    console.log("Manager found:", manager ? "Yes" : "No");

    if (!manager) {
      console.log("Manager not found with ID:", req.params.id);
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    }

    console.log("Manager approved successfully:", manager.email);
    res.status(200).json({
      success: true,
      message: "Manager approved successfully",
      data: manager,
    });
  } catch (error) {
    console.error("=== APPROVE MANAGER ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    next({ status: 500, message: "Failed to approve manager" });
  }
};

export const rejectManager = async (req, res, next) => {
  try {
    const manager = await Manager.findByIdAndUpdate(
      req.params.id,
      { status: "Inactive" },
      { new: true },
    ).select("-password");

    if (!manager) {
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    }

    res.status(200).json({
      success: true,
      message: "Manager rejected successfully",
      data: manager,
    });
  } catch (error) {
    console.error("Reject manager error:", error);
    next({ status: 500, message: "Failed to reject manager" });
  }
};

// ==================== EMPLOYEE MANAGEMENT ====================

export const getAllEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, managerId, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (managerId) query.manager = managerId;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await User.find(query)
      .select("-password")
      .populate("manager", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all employees error:", error);
    next({ status: 500, message: "Failed to fetch employees" });
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id)
      .select("-password")
      .populate("manager", "firstName lastName email");

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Get employee's tasks
    const tasks = await Task.find({ assignee: employee._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: { ...employee.toObject(), recentTasks: tasks },
    });
  } catch (error) {
    console.error("Get employee by id error:", error);
    next({ status: 500, message: "Failed to fetch employee" });
  }
};

export const approveEmployee = async (req, res, next) => {
  try {
    const employee = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Active" },
      { new: true },
    ).select("-password");

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee approved successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Approve employee error:", error);
    next({ status: 500, message: "Failed to approve employee" });
  }
};

export const rejectEmployee = async (req, res, next) => {
  try {
    const employee = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Inactive" },
      { new: true },
    ).select("-password");

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee rejected successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Reject employee error:", error);
    next({ status: 500, message: "Failed to reject employee" });
  }
};

export const transferEmployee = async (req, res, next) => {
  try {
    const { newManagerId } = req.body;
    const employeeId = req.params.id;

    const employee = await User.findById(employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const newManager = await Manager.findById(newManagerId);
    if (!newManager) {
      return res
        .status(404)
        .json({ success: false, message: "New manager not found" });
    }

    // Remove from old manager if exists
    if (employee.manager) {
      await Manager.findByIdAndUpdate(employee.manager, {
        $pull: { teamMembers: employeeId },
        $inc: { teamSize: -1 },
      });
    }

    // Update employee's manager
    employee.manager = newManagerId;
    await employee.save();

    // Add to new manager's team
    await Manager.findByIdAndUpdate(newManagerId, {
      $addToSet: { teamMembers: employeeId },
      $inc: { teamSize: 1 },
    });

    res.status(200).json({
      success: true,
      message: "Employee transferred successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Transfer employee error:", error);
    next({ status: 500, message: "Failed to transfer employee" });
  }
};

// ==================== TASK MANAGEMENT ====================

export const createTask = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const { title, description, assignee, priority, dueDate } = req.body;

    // Validate assignee exists (can be User or Manager)
    const userAssignee = await User.findById(assignee);
    const managerAssignee = await Manager.findById(assignee);

    if (!userAssignee && !managerAssignee) {
      return res
        .status(404)
        .json({ success: false, message: "Assignee not found" });
    }

    const newTask = await Task.create({
      title,
      description,
      assignee, // Can be user or manager ID
      assigneeType: "manager", // Admin assigns to Manager
      priority,
      dueDate,
      createdBy: adminId, // Created by Admin
      createdByType: "Admin", // Optional flag if schema supports it, otherwise effectively just an ID
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
    next({ status: 400, message: error.message || "Failed to create task" });
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;

    const query = {};
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
    console.error("Get all tasks error:", error);
    next({ status: 500, message: "Failed to fetch tasks" });
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignee", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Get task by id error:", error);
    next({ status: 500, message: "Failed to fetch task" });
  }
};

// ==================== REPORTS ====================

export const getSystemOverview = async (req, res, next) => {
  try {
    // Task completion rate
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const completionRate =
      totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $nin: ["completed", "cancelled"] },
    });

    // Monthly task creation trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Task.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        completionRate,
        totalTasks,
        completedTasks,
        overdueTasks,
        tasksByStatus,
        tasksByPriority,
        monthlyTrend,
      },
    });
  } catch (error) {
    console.error("System overview error:", error);
    next({ status: 500, message: "Failed to fetch system overview" });
  }
};

export const getWorkloadReport = async (req, res, next) => {
  try {
    // Workload by manager
    const workloadByManager = await Task.aggregate([
      { $match: { status: { $nin: ["completed", "cancelled"] } } },
      { $group: { _id: "$createdBy", activeTasks: { $sum: 1 } } },
      {
        $lookup: {
          from: "managers",
          localField: "_id",
          foreignField: "_id",
          as: "manager",
        },
      },
      { $unwind: "$manager" },
      {
        $project: {
          _id: 1,
          activeTasks: 1,
          managerName: {
            $concat: ["$manager.firstName", " ", "$manager.lastName"],
          },
        },
      },
    ]);

    // Employees with most tasks
    const topEmployees = await Task.aggregate([
      { $match: { assignee: { $ne: null } } },
      { $group: { _id: "$assignee", taskCount: { $sum: 1 } } },
      { $sort: { taskCount: -1 } },
      { $limit: 10 },
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
          taskCount: 1,
          employeeName: {
            $concat: ["$employee.firstName", " ", "$employee.lastName"],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        workloadByManager,
        topEmployees,
      },
    });
  } catch (error) {
    console.error("Workload report error:", error);
    next({ status: 500, message: "Failed to fetch workload report" });
  }
};
