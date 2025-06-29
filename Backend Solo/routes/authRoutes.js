const express = require("express")
const { registerController } = require("../controller/authController")
const { registerValidation } = require("../middleware/validation")
const {authenticateToken} = require("../middleware/auth")

const authRouter = express.Router()

authRouter.post("/register", registerValidation, registerController);
authRouter.post("/login", )
authRouter.get('/profile', )

module.exports = {authRouter}