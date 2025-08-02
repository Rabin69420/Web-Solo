import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  getPropertyStats
} from '../controllers/propertyController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import {
  validateProperty,
  validateId,
  validatePagination
} from '../middleware/validation.js';
import { uploadMultiple, handleUploadError } from '../middleware/upload.js';

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

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many upload requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/', generalLimiter, validatePagination, optionalAuth, getAllProperties);
router.get('/featured', generalLimiter, getFeaturedProperties);
router.get('/:id', generalLimiter, validateId, optionalAuth, getPropertyById);
router.get('/:id/stats', generalLimiter, validateId, authenticate, authorize('admin'), getPropertyStats);

router.post('/',
  uploadLimiter,
  authenticate,
  authorize('admin'),
  uploadMultiple('images', 10),
  handleUploadError,
  validateProperty,
  createProperty
);

router.put('/:id',
  uploadLimiter,
  authenticate,
  authorize('admin'),
  validateId,
  uploadMultiple('images', 10),
  handleUploadError,
  validateProperty,
  updateProperty
);

router.delete('/:id',
  generalLimiter,
  authenticate,
  authorize('admin'),
  validateId,
  deleteProperty
);

export default router;