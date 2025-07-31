const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const authController = require("../controllers/authController.js");
const { authenticateToken } = require("../middleware/auth.js");
const { registerValidation, loginValidation } = require("../middleware/validation.js");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, registerValidation, authController.register);
router.post("/login", authLimiter, loginValidation, authController.login);
router.get("/profile", authenticateToken, authController.getProfile);
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
