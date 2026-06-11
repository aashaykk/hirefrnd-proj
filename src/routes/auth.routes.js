const { Router } = require("express")
const authController = require("../controllers/auth.controller.js")
const authMiddleware = require("../middlewares/auth.middleware.js")

const authRouter = Router()


authRouter.post("/register", authController.registerUser)

authRouter.post("/login", authController.logInUser)

authRouter.get("/logout", authController.logoutUser)

authRouter.get("/get-me", authMiddleware.authUser, authController.getUser)

module.exports = authRouter