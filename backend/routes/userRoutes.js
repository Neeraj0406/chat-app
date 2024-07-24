import express from "express"
import { acceptRequest, getMyFriends, getProfile, login, newUser, searchNewFriend, searchMyFriends, sendFriendRequest, showAllRequest } from "../controller/userController.js"
import { isAuthenticatedUser } from "../middlewares/auth.js"
import { upload } from "../middlewares/multer.js"
import ValidateRequest from "../middlewares/requestValidate.js"
import { loginValidation } from "../utils/validation.js"

const router = express.Router()

router.post("/register", upload.single("avatar"), newUser)
router.post("/login", ValidateRequest(loginValidation), login)

router.get("/profile", isAuthenticatedUser, getProfile)

router.get("/search-my-friends", isAuthenticatedUser, searchMyFriends)
router.post("/send-request", isAuthenticatedUser, sendFriendRequest)
router.post("/accept-request", isAuthenticatedUser, acceptRequest)
router.post("/show-all-requests", isAuthenticatedUser, showAllRequest)
router.get("/my-friends", isAuthenticatedUser, getMyFriends)
router.post("/search", isAuthenticatedUser, searchNewFriend)


export default router