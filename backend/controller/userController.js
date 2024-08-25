import { EmitEvents } from "../constants/events.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { User } from "../models/userModel.js";
import { showError, showResponse, showServerError } from "../utils/apiResponse.js";
import { bcryptPassword, emitEvent, sendToken, uploadFilesToCloudinary, verifyPassword } from "../utils/helper.js";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;





const newUser = async (req, res) => {
    try {

        const { name, username, password, bio, avatar } = req.body
        const hashedPassword = await bcryptPassword(password)

        const namePresentInDB = await User.findOne({ username })
        if (namePresentInDB) {
            return showError(res, "Username is already present")
        }


        const file = req.file
        if (!file) {
            return showError(res, "Please upload avatar")
        }

        const result = await uploadFilesToCloudinary([file])

        const userAvatar = {
            public_id: result[0].public_id,
            url: result[0].url
        }

        const user = await User.create({
            name,
            username,
            password: hashedPassword,
            bio,
            avatar: userAvatar
        })
        return res.status(201).json({
            data: user,
            message: "Registered Successfully"
        })
    } catch (error) {
        console.log("catch error", error.message);

        return showServerError(res)

    }
}


const login = async (req, res) => {
    try {
        const { username, password } = req.body
        let usernameFound = await User.findOne({ username }).select("+password").lean()
        console.log(usernameFound)
        if (!usernameFound) {
            return showError(res, "Invalid username or password")
        }

        const passwordVerified = await verifyPassword(password, usernameFound.password)
        if (!passwordVerified) {
            return showError(res, "Invalid username or password")
        }
        let token = sendToken({ _id: usernameFound?._id })
        console.log("token", token)
        delete usernameFound.password
        usernameFound.token = token

        return res.status(200).json({
            data: usernameFound,
            message: "User logged in successfully"
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



const searchMyFriends = async (req, res) => {
    try {
        const { name } = req.query

        const userDetails = await User.findById(req.id)

        const allMyFriends = await User.find({
            friends: { $in: [req.id] },
            _id: { $ne: req.id }
        })

        return showResponse(res, allMyFriends)



    } catch (error) {
        console.log(error);

        return showServerError(res)
    }
}


const sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body

        if (userId?.toString == req.id.toString()) {
            return showError(res, "You cannot send request to yourself")
        }

        const userFound = await User.findOne({
            _id: userId,
        });

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


        emitEvent(res, EmitEvents.NEW_REQUEST, [userId])
        return showResponse(res, {}, "Request sent successfully")





    } catch (error) {
        return showServerError(res)
    }
}


const acceptRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body

        const request = await Request.findById(requestId).populate("sender", "name").populate("receiver", "name")
        if (!request) {
            return showError(res, "Request not found")
        }

        if (request.receiver._id?.toString() != req.id?.toString()) {
            return showError(res, "You are not authorized to accept this request")
        }


        if (status == "false") {
            await request.deleteOne()
            return showResponse(res, {}, "Request rejected successfully")
        }

        else {
            const isChatAlreadyPresent = await Chat.findOne({
                groupChat: false,
                members: {
                    $all: [request.receiver._id, request.sender._id]
                }
            })


            if (isChatAlreadyPresent) {
                await Request.deleteOne({ _id: requestId })
                return showError(res, "You both are already friends")
            }



            const members = [request.sender._id, request.receiver._id]
            const [newChat, deletedRequest] = await Promise.all([
                Chat.create({
                    name: `${request.sender.name}-${request.receiver.name}`,
                    members: members
                }),
                request.deleteOne()
            ])

            const [senderDetails, recieverDetials] = await Promise.all([User.findById(request.sender._id), User.findById(request.receiver._id)]);
            senderDetails.friends.push(request.receiver._id)
            recieverDetials.friends.push(request.sender._id)

            await senderDetails.save()
            await recieverDetials.save()



            emitEvent(req, EmitEvents.REFETCH_CHATS, members)

            return showResponse(res, newChat, "Request accepted successfully")

        }


    } catch (error) {
        console.log(error)
        return showServerError(res)
    }
}


const showAllRequest = async (req, res) => {
    try {
        const { pageSize, pageNumber, search } = req.body

        const skipCon = {
            limit: pageSize,
            skip: (pageNumber - 1) * pageSize
        }

        // const allRequest = await Request.aggregate([
        //     {
        //         $match: {
        //             receiver: new ObjectId(req.id)
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "users",
        //             as: "sender",
        //             foreignField: "_id",
        //             localField: "sender"
        //         }
        //     },
        //     {
        //         $unwind: "$sender"
        //     },
        //     {
        //         $match: {
        //             "sender.name": new RegExp(search, "i")
        //         }
        //     },
        //     {
        //         $skip: (pageNumber - 1) * pageSize
        //     },
        //     {
        //         $limit: pageSize
        //     }
        // ])

        const allRequestPromise = Request.aggregate([
            {
                $match: {
                    receiver: new ObjectId(req.id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    as: "sender",
                    localField: "sender",
                    foreignField: "_id"

                }
            },
            {
                $unwind: "$sender"
            },
            {
                $match: {
                    "sender.name": new RegExp(search, "i")
                }
            },
            {
                $project: {
                    "_id": 1,
                    "sender.name": 1,
                    "sender.username": 1,
                    "sender.avatar.url": 1
                }
            },

            {
                $skip: (pageNumber - 1) * pageSize
            },
            {
                $limit: pageSize
            }
        ])

        const totalCountPromise = Request.aggregate([
            {
                $match: {
                    receiver: new ObjectId(req.id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    as: "sender",
                    localField: "sender",
                    foreignField: "_id"

                }
            },
            {
                $match: {
                    "sender.name": new RegExp(search, "i")
                }
            },
            {
                $count: "total"
            },
        ])


        const [allRequest, totalCount] = await Promise.all([allRequestPromise, totalCountPromise])
        return showResponse(res, { allRequest, totalCount: totalCount[0]?.total })

    } catch (error) {
        console.log(error)
        return showServerError(res)
    }
}



const getMyFriends = async (req, res) => {
    try {
        const { name: searchName } = req.query

        const myFriends = await User.aggregate([
            {
                $match: {
                    _id: new ObjectId(req.id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    as: "friend",
                    localField: "friends",
                    foreignField: "_id"
                }
            },
            {
                $unwind: "$friend"
            },
            {
                $match: searchName ? { "friend.name": new RegExp(searchName, "i") } : {}

            },
            {
                $project: {
                    "friend._id": 1,
                    "friend.name": 1,
                    "friend.username": 1,
                    "friend.avatar.url": 1,

                }
            }
        ])

        // const myFriends = await User.findById(req.id).populate({
        //     path: 'friends',
        //     select: 'name username avatar.url'
        // });



        return showResponse(res, myFriends)
    } catch (error) {
        console.log(error)
        return showServerError(res)
    }
}


const searchNewFriend = async (req, res) => {
    try {
        const userId = req.id;
        const { pageSize, pageNumber, search: searchName } = req.body;

        let con = {
            _id: { $ne: new ObjectId(userId) },
            friends: { $nin: [new ObjectId(userId)] }
        }

        if (searchName) {
            con.name = new RegExp(searchName, "i")
        }

        const totalCount = await User.countDocuments(con);


        const newUsers = await User.aggregate([
            {
                $match: con
            },

            {
                $lookup: {
                    from: "requests",
                    let: { otherUserId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $and: [{ $eq: ["$sender", new ObjectId(userId)] }, { $eq: ["$receiver", "$$otherUserId"] }] },
                                        { $and: [{ $eq: ["$sender", "$$otherUserId"] }, { $eq: ["$receiver", new ObjectId(userId)] }] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "requests"
                }
            },
            {
                $project: {
                    name: 1,
                    username: 1,
                    "avatar.url": 1,

                    status: { $gt: [{ $size: "$requests" }, 0] },

                    pendingFromOurSide: {
                        $cond: {
                            if: { $gt: [{ $size: "$requests" }, 0] },
                            then: {
                                $anyElementTrue: {
                                    $map: {
                                        input: "$requests",
                                        as: "request",
                                        in: { $eq: ["$$request.receiver", new ObjectId(userId)] }
                                    }
                                }
                            },
                            else: false
                        }
                    },
                    requestId: {
                        $cond: {
                            if: { $gt: [{ $size: "$requests" }, 0] },
                            then: { $arrayElemAt: ["$requests._id", 0] },
                            else: null
                        }
                    }

                }
            },
            {
                $skip: (pageNumber - 1) * pageSize
            },
            {
                $limit: pageSize
            }
        ])

        return showResponse(res, { data: newUsers, totalCount })

    } catch (error) {
        console.log(error)
        return showServerError(res)
    }
}


export { acceptRequest, getMyFriends, getProfile, login, newUser, searchMyFriends, sendFriendRequest, showAllRequest, searchNewFriend };
