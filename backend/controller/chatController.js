import { EmitEvents } from "../constants/events.js"
import { Chat } from "../models/chat.js"
import { Message } from "../models/message.js"
import { User } from "../models/userModel.js"
import { showError, showResponse, showServerError } from "../utils/apiResponse.js"
import { deleteFilesFromCloudinary, emitEvent, uploadFilesToCloudinary } from "../utils/helper.js"

const newGroupChat = async (req, res) => {
    try {
        const { name, members } = req.body
        const file = req.file

        console.log("grup chat", name, members, file)

        let avatar = {}
        if (file) {
            const result = await uploadFilesToCloudinary([file])
            avatar = {
                public_id: result[0].public_id,
                url: result[0].url
            }
        }


        const allMember = [...members, req.id]
        const newGroup = await Chat.create({
            name,
            groupChat: true,
            members: allMember,
            creator: req.id,
            avatar
        })


        emitEvent(req, EmitEvents.ALERT, `Welcome to ${name} group`)
        emitEvent(req, EmitEvents.REFETCH_CHATS, members)

        return showResponse(res, newGroup, "New group has been created successfully", 201)

    } catch (error) {
        console.log(error)
        showServerError(res)
    }
}


const getMyChat = async (req, res) => {
    try {
        const chats = await Chat.find({ members: req.id }).populate(
            {
                path: "members",
                select: "name username avatar.url "
            }
        ).sort({ updatedAt: -1 })
        return showResponse(res, chats, "All chats has fetched")

    } catch (error) {
        showServerError(res)
    }
}


const getMyGroups = async (req, res) => {
    try {
        const myGroups = await Chat.find(
            {
                groupChat: true,
                members: req.id
            }
        ).populate({
            path: "members",
            select: "name username"
        })

        return showResponse(res, myGroups, "No group found")
    } catch (error) {
        showServerError(res)
    }
}


const addMembers = async (req, res) => {
    try {
        const { members, chatId } = req.body


        if (members?.length < 1) {
            return showError(res, "Please provide member")
        }

        const group = await Chat.findOne({
            _id: chatId,
            groupChat: true,
        }).populate({
            path: "members",
            select: "name username"
        })


        if (!group || group.groupChat == false) {
            return showError(res, "No group found")
        }

        const alreadyPresentMembers = []
        members?.map((mem) => {
            const isPresent = group?.members?.find((gmem) => gmem?._id == mem)
            if (isPresent) {
                alreadyPresentMembers.push(isPresent.name)
            }
        })

        if (alreadyPresentMembers?.length > 0) {
            return showError(res, `${alreadyPresentMembers?.toString()} is already present in the group`)
        }

        const newMembersPromise = members?.map((memberId) => User.findById(memberId))
        const newMembers = await Promise.all(newMembersPromise)
        const newMembersName = (newMembers?.map((newMem) => newMem.name)).toString()

        const updatedGroup = await Chat.findByIdAndUpdate(
            { _id: chatId },
            {
                members: [...group.members, members]
            },
            { new: true }
        )

        emitEvent(req, EmitEvents.ALERT, updatedGroup.members, `${newMembersName} has been to the group`)
        emitEvent(req, EmitEvents.REFETCH_CHATS, updatedGroup.members)

        return showResponse(res, updatedGroup, "Member has been added successfully")
    } catch (error) {
        console.log("error", error)
        showServerError(res)
    }
}


const removeMembers = async (req, res) => {
    try {
        const { chatId, members } = req.body

        const chat = await Chat.findOne({ _id: chatId, groupChat: true })

        if (!chat) {
            return showError(res, "Group not found")
        }
        if (members?.length < 1) {
            return showError(res, "Please provide members")
        }


        let notPresentUsers = []
        members?.map((member) => {
            if (!chat.members.includes(member)) {
                notPresentUsers.push(member)
            }
        })


        if (notPresentUsers?.length > 0) {
            const notPresentUserDataPromise = notPresentUsers?.map((user) => User.findById(user))
            const notPresentUsersData = await Promise.all(notPresentUserDataPromise)
            const newPresentUsersName = notPresentUsersData?.map((data) => data.name)
            return showError(res, `${newPresentUsersName} are not present in the group`)
        }
        console.log("chat", chat.members, members)
        const newMembersList = chat.members.filter((chatMember) => !members.some(member => member.toString() === chatMember.toString()));

        chat.members = newMembersList
        await chat.save()

        const deleteMemberPromise = members?.map((member) => User.findById(member).select("name"))
        const deleteMemberData = await Promise.all(deleteMemberPromise)
        const deleteMemberName = deleteMemberData?.map((data) => data?.name)


        emitEvent(req, EmitEvents.ALERT, chat.members, `${deleteMemberName} has been to the group`)
        emitEvent(req, EmitEvents.REFETCH_CHATS, chat.members)



        return showResponse(res, chat, `${deleteMemberName} has been removed from the chat`)





    } catch (error) {
        console.log(error)
        showServerError(res)
    }
}


const leaveGroup = async (req, res) => {
    try {
        const { chatId } = req.params

        let chat = await Chat.findById(chatId)

        if (!chat) {
            return showError(res, "Group not found")
        }

        const userPresentInMember = chat.members.find((member) => member._id.toString() == req.id?.toString())
        if (!userPresentInMember) {
            return showError(res, "You are already not present in this group")
        }

        chat.members = chat?.members?.filter((member) => member._id.toString() != req.id?.toString())

        if (chat.creator.toString() == req.id.toString()) {
            chat.creator = chat.members[0]
        }
        const leftUserDetails = await User.findById(req.id)
        await chat.save()

        emitEvent(req, EmitEvents.ALERT, `${leftUserDetails?.name} has left the group`)

        return showResponse(res, {}, "You successfully left the group")

    } catch (error) {
        console.log(error)
        return showServerError(res)
    }
}


const sendAttachments = async (req, res) => {
    try {
        const { chatId } = req.body

        const [chat, user] = await Promise.all([
            Chat.findById(chatId),
            User.findById(req.id, "name avatar")
        ])

        if (!chat) {
            return showError(res, "Chat not found")
        }

        const files = req.files ?? []
        if (files.length > 1) {
            return showError(res, "Please provide attachments")
        }

        const attachments = []

        const messageForRealTime = {
            content: "",
            attachments,
            sender: {
                _id: req.id,
                name: user.name,
                avatar: avatar.url
            },
            chat: chatId
        }

        const messageForDB = {
            content: "",
            attachments,
            sender: req.id,
            chat: chatId
        }

        const message = await Message.create(messageForDB)

        emitEvent(req, EmitEvents.NEW_ATTACHMENT, chat.members, {
            message: messageForRealTime,
            chatId
        })

        emitEvent(req, EmitEvents.NEW_MESSAGE_ALERT, chat.members, { chatId })

        return showResponse(res, message)
    } catch (error) {
        return showServerError(res)
    }
}


const getChatDetails = async (req, res) => {
    try {
        const { chatId } = req.params
        let chat = await Chat.findById(chatId).populate({
            path: "members",
            select: "name  avatar username",

        })

        if (!chat) {
            return showError(res, "No chat found")
        }

        return showResponse(res, chat)

    } catch (error) {
        return showServerError(res)
    }
}


const renameGroup = async (req, res) => {
    try {
        const { name } = req.body
        const { chatId } = req.params



        let chat = await Chat.findById(chatId)
        if (!chat) {
            return showError(res, "Chat not found")
        }

        if (!chat.groupChat) {
            return showError(res, "Cannot change name")
        }
        if (chat.creator?.toString() != req.id?.toString()) {
            return showError(res, "Only admin can change the name of group")
        }

        chat.name = name
        await chat.save()
        return showResponse(res, chat, "Group name updated successfully")


    } catch (error) {
        // console.log(error)
        return showServerError(res)
    }
}


const deleteChatDetails = async (req, res) => {
    try {
        const { chatId } = req.params

        let chat = await Chat.findById(chatId)
        if (!chat) {
            return showError(res, "Chat not found")
        }

        if (!chat.groupChat) {
            return showError(res, "Cannot change name")
        }
        if (chat.creator?.toString() != req.id?.toString()) {
            return showError(res, "Only admin can change the name of group")
        }

        const messageWithAttachments = await Message.find({
            chat: chatId,
            attachments: { $exists: true, $ne: [] }
        })
        let publicIds = []


        messageWithAttachments?.forEach(({ attachments }) =>
            attachments?.forEach(({ public_id }) =>
                publicIds.push(public_id)))


        await Promise.all([
            deleteFilesFromCloudinary(publicIds),
            chat.deleteOne(),
            Message.deleteMany({ chat: chatId })
        ])

        emitEvent(req, EmitEvents.REFETCH_CHATS, chat.members)

        return showResponse(res, {}, "Chat deleted successfully")
    } catch (error) {
        return showServerError(res)
    }
}


const getChatMessage = async (req, res) => {
    try {
        const chatId = req.params
        const { page = 1, limit = 20 } = req.query

        const [message, messageCount] = await Promise.all([
            Message.find({ chat: chatId })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("sender", "name avatar")
                .lean(),
            Message.countDocuments({ chat: chatId })
        ])

        return showResponse(res, { data: message, totalCount: messageCount })

    } catch (error) {
        return showServerError(res)
    }
}

const updateGroup = async (req, res) => {
    const { chatId, members, name, deletedPhotoPublicId } = req.body
    console.log("req.body", req.body)
    let newAvatar = {}
    const chatDetails = await Chat.findById(chatId)


    if (!chatDetails) {
        return showError(res, "Chat not found")
    }
    if (!chatDetails.groupChat) {
        return showError(res, "Invalid operation")
    }

    if (chatDetails.creator != req.id?.toString()) {
        return showError(res, "Unauthorized!!  Only admin can change the group name")
    }
    if (deletedPhotoPublicId) {
        await deleteFilesFromCloudinary([deletedPhotoPublicId])
        const newFiles = await uploadFilesToCloudinary([req.file])
        newAvatar = {
            public_id: newFiles[0].public_id,
            url: newFiles[0].url
        }
    }


    chatDetails.name = name
    chatDetails.members = [...members, req.id]
    if (deletedPhotoPublicId) {
        chatDetails.avatar = newAvatar
    }

    console.log("chatDetails", chatDetails)
    await chatDetails.save()

    return showResponse(res, chatDetails, "Group updated successfully")
    // const chat = await Chat.findById(chatId)
    // chat.name = name
    // chat.members = members


    // if (avatarChanged) {
    //     uploadFilesToCloudinary([req.file])
    //     // chat.members = members
    // }

}


const getAllMessages = async (req, res) => {
    try {
        const { chatId } = req.params
        const chat = await Chat.findById(chatId)
        console.log("chat", chat)
        if (!chat) {
            return showError(res, "Invalid Chat id")
        }
        const memberFound = chat.members.find((member) => member?.toString() == req?.id?.toString())
        console.log("memberFound", memberFound, chat.members, req?.id)
        if (!memberFound) {
            return showError(res, "Invalid chat id")
        }

        const messages = await Message.find({ chatId }).populate({
            path: "sender",
            select: "avatar name"
        })

        return showResponse(res, messages)

    } catch (error) {
        console.log("error", error)
        showServerError(res)
    }
}


export { newGroupChat, getMyChat, getMyGroups, addMembers, removeMembers, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChatDetails, getChatMessage, updateGroup, getAllMessages }