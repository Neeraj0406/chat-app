import express from "express"
const app = express()
import dotenv from "dotenv"
import { connectDB } from "./utils/connectDb.js"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoute.js"
import { EmitEvents } from "./constants/events.js"
import { Server } from "socket.io"
import { createServer } from "http"
import { emitEvent, getSockets } from "./utils/helper.js"
import { v4 as uuid } from "uuid"
import { Message } from "./models/message.js"
import cors from "cors"
import { v2 as cloudinary } from "cloudinary"
import { socketAuthenticator } from "./middlewares/auth.js"

const PORT = process.env.PORT || 8000

dotenv.config()
connectDB()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})



const corsOptions = {
    origin: "http://localhost:3000", // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"],
};

const server = createServer(app)
const io = new Server(server, {
    cors: corsOptions
})
const userSocketIds = new Map()

io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, async (error) => {
        await socketAuthenticator(error, socket, next)
    })
})

io.on("connection", (socket) => {
    console.log("user is connected")


    const user = {
        _id: "668bc9426f33c1618addbcc8",
        name: "Neeraj",
        avatar: {
            public_id: "asdfa",
            url: "asdfhaskdlfhak"
        }
    }
    userSocketIds.set(user._id.toString(), socket.id)


    socket.on(EmitEvents.NEW_MESSAGE, async ({ chatId, members, messages }) => {



        const messageForRealTime = {
            _id: uuid(),
            chatId,
            content: messages,
            sender: {
                _id: user._id,
                name: user.name,
                avatar: user.avatar.url
            },
            createdAt: new Date().toISOString()
        }


        const messageForDB = {
            content: messages,
            sender: user._id,
            chat: chatId
        }
        const memberSocket = getSockets(members, userSocketIds)

        io.to(memberSocket).emit(EmitEvents.NEW_MESSAGE, {
            chatId,
            message: messageForRealTime
        })
        io.to(memberSocket).emit(EmitEvents.NEW_MESSAGE_ALERT, { chatId })

        try {
            await Message.create(messageForDB)
        } catch (error) {
            console.log(error)
        }


        console.log(messageForRealTime)
    })

    socket.on("disconnect", () => {
        userSocketIds.delete(user._id.toString())
        console.log("User is disconnnected")
    })
})

app.use(cors(corsOptions));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.use("/api/v1/user", userRoutes)
app.use("/api/v1/chat", chatRoutes)


server.listen(PORT, () => {
    console.log("Server is running in port " + PORT);
})


export { userSocketIds }