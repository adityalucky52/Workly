import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMembersToGroup,
  removeMembersFromGroup,
  getAvailableMembers,
} from "../controller/group.controller.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// All group routes require authentication and admin role
router.use(authMiddleware);
router.use(requireRole("admin"));

// Get available members (managers & employees) for group creation
router.get("/available-members", getAvailableMembers);

// Group CRUD
router.get("/", getAllGroups);
router.post("/", createGroup);
router.get("/:id", getGroupById);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

// Member management
router.post("/:id/members", addMembersToGroup);
router.delete("/:id/members", removeMembersFromGroup);

export default router;
