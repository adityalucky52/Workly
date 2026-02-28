import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  assignManagerToEmployee,
  getAllManagers,
  getManagerById,
  updateManager,
  approveManager,
  rejectManager,
  getAllEmployees,
  getEmployeeById,
  approveEmployee,
  rejectEmployee,
  transferEmployee,
  createTask,
  getAllTasks,
  getTaskById,
  getSystemOverview,
  getWorkloadReport,
} from "./admin.controller.js";
import { authMiddleware, requireRole } from "../../middleware/authMiddleware.js";

const router = Router();

// Log all admin requests for debugging
router.use((req, res, next) => {
  next();
});

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(requireRole("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/assign-manager", assignManagerToEmployee);

// Manager management
router.get("/managers", getAllManagers);
router.get("/managers/:id", getManagerById);
router.put("/managers/:id", updateManager);
router.put("/managers/:id/approve", approveManager);
router.put("/managers/:id/reject", rejectManager);

// Employee management
router.get("/employees", getAllEmployees);
router.get("/employees/:id", getEmployeeById);
router.put("/employees/:id/approve", approveEmployee);
router.put("/employees/:id/reject", rejectEmployee);
router.put("/employees/:id/transfer", transferEmployee);

// Task management
router.post("/tasks", createTask);
router.get("/tasks", getAllTasks);
router.get("/tasks/:id", getTaskById);

// Reports
router.get("/reports/overview", getSystemOverview);
router.get("/reports/workload", getWorkloadReport);

export default router;
