import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createReview,
  getPropertyReviews,
  getUserReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
  getReviewStats
} from '../controllers/reviewController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  validateReview,
  validateId,
  validatePagination
} from '../middleware/validation.js';
import { body } from 'express-validator';
import { Review, User, Property, Booking } from '../models/index.js';

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

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many review requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/stats', generalLimiter, authenticate, authorize('admin'), getReviewStats);
router.get('/my-reviews', generalLimiter, authenticate, validatePagination, getUserReviews);
router.get('/property/:propertyId', generalLimiter, validateId, validatePagination, getPropertyReviews);
router.get('/', generalLimiter, authenticate, authorize('admin'), validatePagination, getAllReviews);
router.get('/:id', generalLimiter, authenticate, validateId, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Property,
          attributes: ['id', 'title', 'location']
        },
        {
          model: Booking,
          attributes: ['id', 'startDate', 'endDate']
        }
      ]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (req.user.role !== 'admin' && review.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message
    });
  }
});

router.post('/',
  reviewLimiter,
  authenticate,
  validateReview,
  createReview
);

router.put('/:id/status',
  generalLimiter,
  authenticate,
  authorize('admin'),
  validateId,
  [
    body('status')
      .isIn(['pending', 'approved', 'rejected'])
      .withMessage('Invalid status'),
    body('adminResponse')
      .optional()
      .isString()
      .withMessage('Admin response must be a string')
  ],
  updateReviewStatus
);

router.delete('/:id',
  generalLimiter,
  authenticate,
  validateId,
  deleteReview
);

export default router;