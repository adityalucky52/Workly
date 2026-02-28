import { Router } from "express";
import {
  getDashboardStats,
  getTeamMembers,
  getTeamMemberById,
  getTeamWorkload,
  createTask,
  getMyTasks,
  getAssignedTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTeamPerformance,
  getTaskCompletion,
} from "./manager.controller.js";
import { authMiddleware, requireRole } from "../../middleware/authMiddleware.js";

const router = Router();

// All manager routes require authentication and manager role
router.use(authMiddleware);
router.use(requireRole("manager"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Team management
router.get("/team", getTeamMembers);
router.get("/team/workload", getTeamWorkload);
router.get("/team/:id", getTeamMemberById);

// Task management
router.post("/tasks", createTask);
router.get("/tasks", getMyTasks);
router.get("/tasks/assigned", getAssignedTasks);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

// Reports
router.get("/reports/performance", getTeamPerformance);
router.get("/reports/completion", getTaskCompletion);

export default router;
