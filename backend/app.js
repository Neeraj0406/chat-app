import { v2 as cloudinary } from "cloudinary"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { EmitEvents } from "./constants/events.js"
import { socketAuthenticator } from "./middlewares/auth.js"
import { Chat } from "./models/chat.js"
import { Message } from "./models/message.js"
import chatRoutes from "./routes/chatRoute.js"
import userRoutes from "./routes/userRoutes.js"
import { connectDB } from "./utils/connectDb.js"
import { getMemberSocketId, getSockets, getUserExceptMe } from "./utils/helper.js"
const app = express()

const PORT = process.env.PORT || 8000

dotenv.config()
connectDB()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})



const corsOptions = {
    origin: "*", // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"],
};

const server = createServer(app)
const io = new Server(server, {
    cors: corsOptions
})

app.set("io", io)


const userSocketIds = new Map()

io.use(async (socket, next) => {
    await socketAuthenticator(socket, next)
})

io.on("connection", (socket) => {
    console.log("User Connected to socket")

    const user = socket.user

    const userId = user.id.toString()
    if (userSocketIds.has(userId)) {
        userSocketIds.get(userId).push(socket.id)
    } else {
        userSocketIds.set(userId, [socket.id])
    }

    console.log("userSocketIds", userSocketIds)

    socket.on(EmitEvents.NEW_MESSAGE, async ({ chatId, message }) => {
        const messageForDb = {
            content: message,
            chatId,
            sender: user
        }

        const newMessage = await Message.create(messageForDb)


        const messageForRealTime = {
            content: message,
            _id: newMessage?._id,
            sender: {
                _id: user._id,
                name: user.name,
                avatar: user.avatar
            },
            chatId,
            createdAt: newMessage?.createdAt,
        };
        const chat = await Chat.findById(chatId)
        const members = getUserExceptMe(chat.members, user?._id)
        const membersSocket = getMemberSocketId(userSocketIds, members)
        const mineSocketIds = userSocketIds.get(userId)
        console.log("mineSocketIds", mineSocketIds)
        membersSocket?.forEach((socketId) => {
            io.to(socketId).emit(EmitEvents.NEW_MESSAGE, messageForRealTime)
        })


        // add last message to chat model
        chat.lastMessage = message
        console.log("update chat", chat)
        await chat.save()


        // refetch chat list 
        membersSocket?.forEach((socketId) => {
            io.to(socketId).emit(EmitEvents.REFETCH_CHATS, { chatId })
        })
        io.to(mineSocketIds).emit(EmitEvents.REFETCH_CHATS, { chatId })

    })


    socket.on(EmitEvents.START_TYPING, async ({ chatId }) => {
        console.log("user started typing", chatId)
        const chat = await Chat.findOne({ _id: chatId })
        const memberSocketIds = getSockets(chat.members, user?._id)
        io.to(memberSocketIds).emit(EmitEvents.START_TYPING, { user, chatId })
    })
    socket.on(EmitEvents.STOP_TYPING, async ({ chatId }) => {
        console.log("user started typing", chatId)
        const chat = await Chat.findOne({ _id: chatId })
        const memberSocketIds = getSockets(chat.members, user?._id)
        io.to(memberSocketIds).emit(EmitEvents.STOP_TYPING, { user, chatId })
    })

    socket.on("disconnect", () => {
        console.log("User is disconnnected")

        const userSocket = userSocketIds.get(userId)
        const filteredSocket = userSocket?.filter((socketId) => socketId != socket.id)
        if (filteredSocket.length > 0) {
            userSocketIds.set(userId, filteredSocket)
        } else {
            userSocketIds.delete(userId)
        }
        console.log("usersocket", userSocketIds)
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
