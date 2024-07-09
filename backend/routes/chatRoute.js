import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { newGroupChat, getMyChat, getMyGroups, addMembers, removeMembers, leaveGroup, sendAttachments } from "../controller/chatController.js";
import { upload } from "../middlewares/multer.js";
const router = express.Router()

router.use(isAuthenticatedUser)



router.post("/new-group", newGroupChat)

router.get("/my-chats", getMyChat)

router.get("/my-groups", getMyGroups)

router.put("/add-member", addMembers)

router.put("/remove-member", removeMembers)

router.get("/leave-group/:chatId", leaveGroup)

router.post("/message", upload.array("files", 5), sendAttachments)


export default router