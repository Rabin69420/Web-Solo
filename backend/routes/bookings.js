import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  validateBooking,
  validateId,
  validatePagination
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

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many booking requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/stats', generalLimiter, authenticate, authorize('admin'), getBookingStats);
router.get('/my-bookings', generalLimiter, authenticate, validatePagination, getUserBookings);
router.get('/', generalLimiter, authenticate, authorize('admin'), validatePagination, getAllBookings);
router.get('/:id', generalLimiter, authenticate, validateId, getBookingById);

router.post('/',
  bookingLimiter,
  authenticate,
  validateBooking,
  createBooking
);

router.put('/:id/status',
  generalLimiter,
  authenticate,
  authorize('admin'),
  validateId,
  [
    body('status')
      .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
      .withMessage('Invalid status'),
    body('adminNotes')
      .optional()
      .isString()
      .withMessage('Admin notes must be a string')
  ],
  updateBookingStatus
);

router.put('/:id/cancel',
  generalLimiter,
  authenticate,
  validateId,
  [
    body('cancellationReason')
      .optional()
      .isString()
      .withMessage('Cancellation reason must be a string')
  ],
  cancelBooking
);

export default router;