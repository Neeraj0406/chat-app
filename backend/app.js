import express from "express"
const app = express()
import userRoutes from "./routes/userRoutes.js"

import dotenv from "dotenv"
dotenv.config()

app.use("/user", userRoutes)

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running in port 3000");
})