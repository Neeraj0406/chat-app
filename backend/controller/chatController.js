import { EmitEvents } from "../constants/events.js"
import { Chat } from "../models/chat.js"
import { showError, showResponse, showServerError } from "../utils/apiResponse.js"
import { emitEvent } from "../utils/helper.js"

const newGroupChat = async (req, res) => {
    try {
        const { name, members } = req.body

        if (members.length < 2) {
            return showError(res, "Group chat must have atleast 3 members")
        }

        const allMember = [...members, req.id]
        const newGroup = await Chat.create({
            name,
            groupChat: true,
            members: allMember,
            creator: req.id
        })


        emitEvent(req, EmitEvents.ALERT, `Welcome to ${name} group`)
        emitEvent(req, EmitEvents.REFETCH_CHATS, members)

        return showResponse(res, {}, "New group has been created successfully", 201)

    } catch (error) {
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

export { newGroupChat, getMyChat }