import { Router } from "express"
import { login, register, requestPasswordReset, resetPassword } from "../controllers/authControllers"

const authRouter = Router()

authRouter.post("/login", login)
authRouter.post("/register", register)
authRouter.post("/request-password-reset", requestPasswordReset);
authRouter.post("/resetPassword", resetPassword)

export default authRouter