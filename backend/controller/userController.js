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

        console.log("usernameFoundusernameFound", usernameFound)
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
            const members = [request.sender._id, request.receiver._id]
            const [newChat, deletedRequest] = await Promise.all([
                Chat.create({
                    name: `${request.sender.name}-${request.receiver.name}`,
                    members: members
                }),
                request.deleteOne()
            ])

            emitEvent(req, EmitEvents.REFETCH_CHATS, members)

            return showResponse(res, newChat, "Request accepted successfully")

        }


    } catch (error) {
        return showServerError(res)
    }
}


// const showAllRequest = async (req, res) => {
//     try {
//         const { pageSize, pageNumber, search } = req.body

//         const skipCon = {
//             limit: pageSize,
//             skip: (pageNumber - 1) * pageSize
//         }

//         const con = {
//             receiver: req.id,
//         }

//         if (search) {
//             con["$or"] = [
//                 { "sender.name": new RegExp(search, "i") },
//             ]

//         }

//         const request = await Request.find(con, {}, skipCon).populate("sender", "name avatar")

//         console.log("request", request)
//         let requestsData = request.map(({ _id, sender }) => ({
//             _id,
//             sender: {
//                 sender_id: sender._id,
//                 name: sender.name,
//                 avatar: sender.avatar
//             }
//         }))
//         return showResponse(res, requestsData, "All request fetched")
//     } catch (error) {
//         return showServerError(res)
//     }
// }

const showAllRequest = async (req, res) => {
    try {
        const { pageSize, pageNumber, search } = req.body;

        const limit = parseInt(pageSize, 10) || 10;
        const skip = (parseInt(pageNumber, 10) - 1) * limit || 0;

        // Build the query condition
        const con = { receiver: req.id };

        if (search) {
            con["$or"] = [
                { "sender.name": new RegExp(search, "i") }
            ];
        }

        // Fetch requests with pagination and populate sender details
        const requests = await Request.find(con)
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'sender',
                select: 'name avatar'
            });

        console.log("Requests with Population:", requests);

        // Map and format the requests data
        const requestsData = requests.map(({ _id, sender }) => ({
            _id,
            sender: {
                sender_id: sender._id,
                name: sender.name,
                avatar: sender.avatar
            }
        }));

        return showResponse(res, requestsData, "All requests fetched");
    } catch (error) {
        console.error("Error fetching requests:", error);
        return showServerError(res);
    }
};


const getMyFriends = async (req, res) => {
    try {
        // const allMembers = await Chat.find({
        //     groupChat: false,
        //     members: req.id
        // }).populate("members")

        // const myFriends = allMembers.flatMap(({ members }) => members)?.filter(({ _id }) => _id?.toString() != req.id?.toString())
        // const uniqueFriends = []
        // // myFriends?.map((friend) =>{
        // //     uniqueFriends?.find((ufriend))
        // // })
        // return showResponse(res, { myFriends, uniqueFriends, allMembers })
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
            name: new RegExp(searchName, "i")
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


export { acceptRequest, getMyFriends, getProfile, login, newUser, searchUser, sendFriendRequest, showAllRequest, searchNewFriend };
