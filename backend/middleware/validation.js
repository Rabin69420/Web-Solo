import { body, param, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validateProperty = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('propertyType')
    .isIn(['Apartment', 'Villa', 'House', 'Condo', 'Studio', 'Mansion', 'Penthouse'])
    .withMessage('Invalid property type'),
  body('accommodationType')
    .isIn(['whole_house', 'whole_apartment', 'whole_flat', 'single_room', 'multiple_rooms'])
    .withMessage('Invalid accommodation type'),
  body('bedrooms')
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be between 0 and 20'),
  body('bathrooms')
    .isInt({ min: 1, max: 20 })
    .withMessage('Bathrooms must be between 1 and 20'),
  body('maxOccupancy')
    .isInt({ min: 1, max: 50 })
    .withMessage('Max occupancy must be between 1 and 50'),
  handleValidationErrors
];

export const validateBooking = [
  body('propertyId')
    .isInt({ min: 1 })
    .withMessage('Valid property ID is required'),
  body('startDate')
    .isISO8601()
    .toDate()
    .withMessage('Valid start date is required'),
  body('endDate')
    .isISO8601()
    .toDate()
    .withMessage('Valid end date is required'),
  body('guests')
    .isInt({ min: 1 })
    .withMessage('Number of guests must be at least 1'),
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  handleValidationErrors
];

export const validateReview = [
  body('propertyId')
    .isInt({ min: 1 })
    .withMessage('Valid property ID is required'),
  body('bookingId')
    .isInt({ min: 1 })
    .withMessage('Valid booking ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters'),
  body('cleanliness')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Cleanliness rating must be between 1 and 5'),
  body('communication')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Communication rating must be between 1 and 5'),
  body('location')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Location rating must be between 1 and 5'),
  body('value')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Value rating must be between 1 and 5'),
  handleValidationErrors
];

export const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid ID is required'),
  handleValidationErrors
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];