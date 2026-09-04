import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMyProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/", protect, isAdmin, getAllUsers);
router.get("/:id", protect, isAdmin, getUserById);
router.put("/:id/role", protect, isAdmin, updateUserRole);
router.put("/:id/status", protect, isAdmin, updateUserStatus);

export default router;
