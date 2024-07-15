import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const bcryptPassword = async (password) => {
    try {

        if (password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            return hashedPassword
        }
    } catch (error) {
        console.log("Error while hashing password")

    }
}


export const verifyPassword = async (password, hashedPassword) => {
    try {
        if (password && hashedPassword) {
            const result = await bcrypt.compare(password, hashedPassword)
            return result
        } else {
            console.log("password or hashedPassword missing");
        }
    } catch (error) {
        console.log("Error while verifing password");

    }
}

export const sendToken = (payload) => {
    try {


        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h"
        })
        return token
    } catch (error) {
        console.log("Error while creating token");

    }
}

export const verifyToken = (token) => {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodeToken;
};

export const emitEvent = (req, event, users, data) => {
    console.log("emitting event", req, event, users, data);

}

export const deleteFilesFromCloudinary = (publicIds) => {

}


export const getFriendOtherThanMe = () => {

}


export const getSockets = (users = [], userSocketIds) => {
    console.log(users)
    console.log(userSocketIds)
    const sockets = users.map(user => userSocketIds?.get(user))
    return sockets
}