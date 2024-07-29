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
import { getUserExceptMe } from "./utils/helper.js"
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
const userSocketIds = new Map()

io.use(async (socket, next) => {
    await socketAuthenticator(socket, next)
})

io.on("connection", (socket) => {
    console.log("user is connected")

    const user = socket.user

    userSocketIds.set(user._id.toString(), socket.id)


    socket.on(EmitEvents.NEW_MESSAGE, async ({ chatId, message }) => {
        console.log("new message received", message)
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
            },
            chatId,
            createdAt: message?.createdAt,
        };

        const chat = await Chat.findById(chatId)
        const members = getUserExceptMe(chat.members, user?._id)
        console.log(members)
        io.to(members).emit(EmitEvents.NEW_MESSAGE, messageForRealTime)


    })

    // socket.on(EmitEvents.NEW_MESSAGE, async ({ chatId, members, messages }) => {



    //     const messageForRealTime = {
    //         _id: uuid(),
    //         chatId,
    //         content: messages,
    //         sender: {
    //             _id: user._id,
    //             name: user.name,
    //             avatar: user.avatar.url
    //         },
    //         createdAt: new Date().toISOString()
    //     }


    //     const messageForDB = {
    //         content: messages,
    //         sender: user._id,
    //         chat: chatId
    //     }
    //     const memberSocket = getSockets(members, userSocketIds)

    //     io.to(memberSocket).emit(EmitEvents.NEW_MESSAGE, {
    //         chatId,
    //         message: messageForRealTime
    //     })
    //     io.to(memberSocket).emit(EmitEvents.NEW_MESSAGE_ALERT, { chatId })

    //     try {
    //         await Message.create(messageForDB)
    //     } catch (error) {
    //         console.log(error)
    //     }


    //     console.log(messageForRealTime)
    // })

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
