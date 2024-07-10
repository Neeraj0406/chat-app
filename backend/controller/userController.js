import { User } from "../models/userModel.js";
import { showError, showResponse, showServerError } from "../utils/apiResponse.js";
import constant from "../constants/contant.js";
import { bcryptPassword, emitEvent, sendToken, verifyPassword } from "../utils/helper.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { EmitEvents } from "../constants/events.js";


let cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true
}


const newUser = async (req, res) => {
    try {

        const { name, username, password, bio, avatar } = req.body
        const hashedPassword = await bcryptPassword(password)

        const dummyavatar = {
            public_id: "asdfasd",
            url: "asdfa"
        }


        const user = await User.create({
            name,
            username,
            password: hashedPassword,
            bio,
            avatar: dummyavatar
        })
        return res.status(201).json({
            data: user,
            message: "new user created successfully"
        })
    } catch (error) {
        console.log("catch error", error.message);

        return showServerError(res)

    }
}


const login = async (req, res) => {
    try {
        const { username, password } = req.body
        let usernameFound = await User.findOne({ username }).select("+password")

        if (!usernameFound) {
            return showError(res, "Invalid username or password")
        }

        const passwordVerified = await verifyPassword(password, usernameFound.password)
        if (!passwordVerified) {
            return showError(res, "Invalid username or password")
        }
        delete usernameFound.password
        const token = sendToken({ _id: usernameFound?._id })
        usernameFound.token = token
        return res.status(200).cookie(constant.cookieName, token, cookieOptions).json({
            data: usernameFound
        })


    } catch (error) {
        showServerError(res)
    }
}


const getProfile = async (req, res) => {
    try {
        const userProfile = await User.findById(req.id)
        if (!userProfile) {
            return showError(res, "User not found")
        }
        return showResponse(res, userProfile)
    } catch (error) {
        return showServerError(res)
    }

}


const logout = async (req, res) => {
    try {
        return res.status(200)
            .cookie(constant.cookieName, "", { ...cookieOptions, maxAge: 0 })
            .json({
                message: "Logged out successfully"
            })
    } catch (error) {
        showServerError(res)
    }

}


const searchUser = async (req, res) => {
    try {
        const { name } = req.query

        const myChats = await Chat.find({
            groupChat: false,
            members: { $in: req.id }
        })

        const allUserFromMyChats = myChats?.flatMap((chat) => chat.members)
        console.log("name", name);

        const allUserExceptFriends = await User.find(
            {
                _id: { $nin: allUserFromMyChats },
                name: new RegExp(name, "i")
            },
        ).select("name avatar")

        return showResponse(res, allUserExceptFriends)



    } catch (error) {
        console.log(error);

        return showServerError(res)
    }
}


const sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body

        const userFound = await User.findById(userId)

        if (!userFound) {
            return showError(res, "User not found")
        }

        const requestPresent = await Request.findOne({
            $or: [
                {
                    sender: req.id,
                    receiver: userId
                },
                {
                    sender: userId,
                    receiver: req.id
                }
            ]
        })

        if (requestPresent) {
            return showError(res, "Request has already sent")
        }

        const request = await Request.create({
            sender: req.id,
            receiver: userId
        })

        emitEvent(req, userId,)

        return showResponse(res, EmitEvents.NEW_REQUEST, [userId])





    } catch (error) {
        return showServerError(res)
    }
}

export { login, newUser, getProfile, logout, searchUser, sendFriendRequest }