const express = require("express")
const { registerController } = require("../controller/authController")
const { registerValidation } = require("../middleware/validation")

const authRouter = express.Router()

authRouter.post("/register", registerValidation, registerController)

module.exports = {authRouter}