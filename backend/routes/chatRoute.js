import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { newGroupChat, getMyChat, getMyGroups, addMembers, removeMembers, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChatDetails, getChatMessage, updateGroup } from "../controller/chatController.js";
import { upload } from "../middlewares/multer.js";
const router = express.Router()

router.use(isAuthenticatedUser)



router.post("/new-group", upload.single("avatar"), newGroupChat)

router.get("/my-chats", getMyChat)


router.get("/my-chats", getMyChat)

router.get("/my-groups", getMyGroups)

router.put("/add-member", addMembers)

router.put("/remove-member", removeMembers)

router.get("/leave-group/:chatId", leaveGroup)

router.post("/message", upload.array("files", 5), sendAttachments)

router.get("/message/:chatId", getChatMessage)

router.post("/edit-group", updateGroup)

router.route("/:chatId").get(getChatDetails).put(renameGroup).delete(deleteChatDetails)




export default router