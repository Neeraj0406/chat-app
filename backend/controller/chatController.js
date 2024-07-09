import { EmitEvents } from "../constants/events.js"
import { Chat } from "../models/chat.js"
import { User } from "../models/userModel.js"
import { showError, showResponse, showServerError } from "../utils/apiResponse.js"
import { emitEvent } from "../utils/helper.js"

const newGroupChat = async (req, res) => {
    try {
        const { name, members, avatar } = req.body

        if (members.length < 2) {
            return showError(res, "Group chat must have atleast 3 members")
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

        return showResponse(res, {}, "New group has been created successfully", 201)

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
                select: "name username avatar "
            }
        )
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
        console.log("myGroups", myGroups)

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

        chat.members = chat.member.filter((member) => member._id.toString() == req.id?.toString())

        if (chat.creator.toString() == req.id.toString()) {
            chat.creator = chat.members[0]
        }
        const leftUserDetails = await User.findById(req.id)
        await chat.save()

        emitEvent(req, EmitEvents.ALERT, `${leftUserDetails?.name} has left the group`)

        return showResponse(res, "You successfully left the group")

    } catch (error) {
        return showServerError(res)
    }
}


export { newGroupChat, getMyChat, getMyGroups, addMembers, removeMembers, leaveGroup }