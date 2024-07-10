import express from "express"
import { getProfile, login, logout, newUser, searchUser } from "../controller/userController.js"
import { upload } from "../middlewares/multer.js"
import { isAuthenticatedUser } from "../middlewares/auth.js"
import ValidateRequest from "../middlewares/requestValidate.js"
import { loginValidation } from "../utils/validation.js"

const router = express.Router()

router.post("/new", upload.single("avatar"), newUser)
router.post("/login", ValidateRequest(loginValidation), login)

router.get("/profile", isAuthenticatedUser, getProfile)
router.get("/logout", isAuthenticatedUser, logout)

router.get("/search", isAuthenticatedUser, searchUser)



export default router