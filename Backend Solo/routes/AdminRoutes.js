const express = require("express");
const router = express.Router();

const adminController = require("../controllers/AdminController.js");
const { authenticateToken, requireAdmin } = require("../middleware/auth.js");

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard routes
router.get("/dashboard/stats", adminController.getDashboardStats);

// User management routes
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/toggle-status", adminController.toggleUserStatus);
router.patch("/users/:id/status", adminController.updateUserStatus);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
