import { Router } from "express";
import {
  getDashboardStats,
  getMyTasks,
  getTaskById,
  updateTaskStatus,
  getTaskHistory,
  getMyComments,
  addComment,
  getTaskComments,
} from "./employee.controller.js";
import { authMiddleware, requireRole } from "../../middleware/authMiddleware.js";

const router = Router();

// All employee routes require authentication and employee role
router.use(authMiddleware);
router.use(requireRole("employee"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Task management
router.get("/tasks", getMyTasks);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id/status", updateTaskStatus);
router.get("/tasks/:id/comments", getTaskComments);
router.post("/tasks/:id/comments", addComment);

// Activity
router.get("/activity/history", getTaskHistory);
router.get("/activity/comments", getMyComments);

export default router;
