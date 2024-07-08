import { User } from "../models/userModel.js";
import { showError, showResponse, showServerError } from "../utils/apiResponse.js";
import constant from "../constants/contant.js";
import { bcryptPassword, sendToken, verifyPassword } from "../utils/helper.js";


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





    } catch (error) {
        return showServerError(res)
    }
}


export { login, newUser, getProfile, logout, searchUser }