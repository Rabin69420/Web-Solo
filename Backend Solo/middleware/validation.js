const {body} = require("express-validator")

const registerValidation = [
    body("fullName").trim()
    .isLength({min:5})
    .withMessage("FullName must be more than 5 character"),

    body("email").trim().isEmail().normalizeEmail(),
    body("password")
    .trim()
    .isLength({min: 8})
    .withMessage("password must be more than 8 characters")
]

module.exports = { registerValidation };