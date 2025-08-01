const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const propertyController = require("../controllers/propertyController.js");
const { authenticateToken, requireAdmin } = require("../middleware/auth.js");
const { propertyValidation } = require("../middleware/validation.js");

// Rate limiting
const propertyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

// Public routes
router.get("/", propertyLimiter, propertyController.getAllProperties);
router.get("/:id", propertyLimiter, propertyController.getPropertyById);

// Protected routes - require authentication
router.use(authenticateToken);

// Admin/User routes
router.post("/", propertyValidation, propertyController.createProperty);
router.put("/:id", propertyValidation, propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperty);
router.patch("/:id/toggle-status", propertyController.togglePropertyStatus);

module.exports = router;
