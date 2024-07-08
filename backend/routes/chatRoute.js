import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { newGroupChat } from "../controller/chatController.js";
const router = express.Router()

router.use(isAuthenticatedUser)
router.post("/new", newGroupChat)



export default router