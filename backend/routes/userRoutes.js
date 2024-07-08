import express from "express"
import { getProfile, login, logout, newUser, searchUser } from "../controller/userController.js"
import { upload } from "../middlewares/multer.js"
import { isAuthenticatedUser } from "../middlewares/auth.js"

const router = express.Router()

router.post("/new", upload.single("avatar"), newUser)
router.post("/login", login)

router.get("/profile", isAuthenticatedUser, getProfile)
router.get("/logout", isAuthenticatedUser, logout)

router.get("/search", isAuthenticatedUser, searchUser)



export default router