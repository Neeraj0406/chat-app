import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { newGroupChat, getMyChat } from "../controller/chatController.js";
const router = express.Router()

router.use(isAuthenticatedUser)
router.post("/new-group", newGroupChat)
router.get("/my-chats", getMyChat)



export default router