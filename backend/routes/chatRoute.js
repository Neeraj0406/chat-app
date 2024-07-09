import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { newGroupChat, getMyChat, getMyGroups, addMembers, removeMembers, leaveGroup } from "../controller/chatController.js";
import { upload } from "../middlewares/multer.js";
const router = express.Router()

router.use(isAuthenticatedUser)



router.post("/new-group", newGroupChat)

// router.get("/my-chats", upload.single("avatar"), getMyChat)

router.get("/my-chats", getMyChat)

router.get("/my-groups", getMyGroups)

router.put("/add-member", addMembers)

router.put("/remove-member", removeMembers)

router.get("/leave-group/:chatId", leaveGroup)


export default router