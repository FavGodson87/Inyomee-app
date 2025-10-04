import express from "express"
import { loginUser, registerUser, getRewards, validateToken } from "../controllers/userController.js"
import { forgotPassword, resetPassword, verifyResetToken } from "../controllers/passwordResetController.js"
import authMiddleware from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/rewards' , authMiddleware, getRewards)
userRouter.get('/validate', authMiddleware, validateToken)

userRouter.post( '/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/verify-reset-token/:token', verifyResetToken)


export default userRouter