import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
  createAdmin,
  getSystemHealth
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  validateId,
  validatePagination,
  validateRegister
} from '../middleware/validation.js';
import { body } from 'express-validator';

const router = express.Router();

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

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Too many admin requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', adminLimiter, getDashboardStats);
router.get('/system-health', adminLimiter, getSystemHealth);
router.get('/users', adminLimiter, validatePagination, getAllUsers);
router.get('/users/:id', adminLimiter, validateId, getUserById);

router.post('/create-admin',
  adminLimiter,
  validateRegister,
  createAdmin
);

router.put('/users/:id/status',
  adminLimiter,
  validateId,
  [
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'suspended'])
      .withMessage('Invalid status'),
    body('accountType')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Invalid account type'),
    body('verified')
      .optional()
      .isBoolean()
      .withMessage('Verified must be a boolean')
  ],
  updateUserStatus
);

router.delete('/users/:id',
  adminLimiter,
  validateId,
  deleteUser
);

export default router;