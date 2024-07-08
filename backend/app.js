import express from "express"
const app = express()
import dotenv from "dotenv"
import { connectDB } from "./utils/connectDb.js"
import cookieParser from "cookie-parser"

import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoute.js"

const PORT = process.env.PORT || 8000

dotenv.config()
connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/chat", chatRoutes)


app.listen(PORT, () => {
    console.log("Server is running in port " + PORT);
})