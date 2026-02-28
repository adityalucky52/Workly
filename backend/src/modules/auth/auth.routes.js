import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  registerManager,
  loginManager,
  registerEmployee,
  loginEmployee,
  logout,
  getCurrentUser,
} from "./auth.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

// Admin auth routes
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

// Manager auth routes
router.post("/manager/register", registerManager);
router.post("/manager/login", loginManager);

// Employee auth routes
router.post("/employee/register", registerEmployee);
router.post("/employee/login", loginEmployee);

// Common auth routes
router.post("/logout", logout);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
