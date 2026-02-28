import { Router } from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
} from "./profile.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

// All profile routes require authentication (any role)
router.use(authMiddleware);

// Profile
router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/password", changePassword);

// Settings
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

export default router;
