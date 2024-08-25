import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from "cloudinary"
import { v4 as uuid } from "uuid"
import { userSocketIds } from "../app.js"


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
    const io = req.app.get("io")
    users = users?.map((user) => user?.toString())
    const socketIds = getSockets(users, req.id)
    console.log("getting socket id ", socketIds);
    io.to(socketIds).emit(event, data)
}



export const getUserExceptMe = (members, me) => {
    const user = members.filter((member) => member?.toString() != me)

    return user?.map((u) => u?.toString())
}


export const getSockets = (users = [], myId) => {
    console.log("my uid ", myId);

    users = getUserExceptMe(users, myId)
    console.log("users", users);

    const sockets = []
    users.forEach(user => userSocketIds?.get(user)?.forEach((user) => sockets.push(user)))
    return sockets
}

export const getBase64 = (file) => {
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
}



export const uploadFilesToCloudinary = async (files = []) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type: "auto",
                    public_id: uuid()
                }, (error, result) => {
                    if (error) {
                        return reject(error)
                    }
                    resolve(result)
                })
        })
    })

    try {
        const results = await Promise.all(uploadPromises)
        const formattedResult = results.map((result) => ({
            public_id: result.public_id,
            url: result.url
        }))

        return formattedResult
    } catch (error) {
        console.log(error)
    }
}


export const deleteFilesFromCloudinary = async (publicIds) => {
    const deletePromises = publicIds.map((publicId) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    });

    try {
        const result = await Promise.all(deletePromises)
        return result
    } catch (error) {
        console.log("Error while deleting image from cloudinary")
        return error
    }
}


export const getMemberSocketId = (userSocketIds, members) => {
    const memberSocket = members?.map((member) => userSocketIds.get(member))
    return memberSocket

}

