import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors
} from '../middleware/validation.js';
import { body } from 'express-validator';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/verify', generalLimiter, authenticate, verifyToken);
router.get('/profile', generalLimiter, authenticate, getProfile);
router.put('/profile', generalLimiter, authenticate, updateProfile);
router.put('/change-password', authLimiter, authenticate, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  handleValidationErrors
], changePassword);

router.post('/upload-avatar', 
  generalLimiter,
  authenticate,
  uploadSingle('avatar'),
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      await req.user.update({ avatar: avatarUrl });

      res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: {
          avatar: avatarUrl
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error uploading avatar',
        error: error.message
      });
    }
  }
);

export default router;