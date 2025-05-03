import { Router } from "express"
import { login, register, logout, requestPasswordReset, resetPassword } from "../controllers/authControllers"

const authRouter = Router()

authRouter.post("/login", login)
authRouter.post("/register", register)
authRouter.delete("/logout", logout)
authRouter.post("/request-password-reset", requestPasswordReset);
authRouter.post("/resetPassword", resetPassword)

export default authRouter