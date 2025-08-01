const { body } = require("express-validator");

const registerValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers"),

  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),

  body("gender")
    .isIn(["male", "female", "other", "prefer-not-to-say"])
    .withMessage("Please select a valid gender option"),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];

// Property validation
const propertyValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Property title must be between 3 and 200 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("price")
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("type")
    .isIn(["apartment", "house", "studio", "room"])
    .withMessage("Invalid property type"),

  body("bedrooms")
    .isInt({ min: 1, max: 10 })
    .withMessage("Bedrooms must be between 1 and 10"),

  body("bathrooms")
    .isInt({ min: 1, max: 10 })
    .withMessage("Bathrooms must be between 1 and 10"),

  body("maxOccupancy")
    .isInt({ min: 1, max: 20 })
    .withMessage("Max occupancy must be between 1 and 20"),

  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
];

module.exports = {
  registerValidation,
  loginValidation,
  propertyValidation,
};
