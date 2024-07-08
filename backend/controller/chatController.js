import { Chat } from "../models/chat.js"
import { showError, showResponse, showServerError } from "../utils/apiResponse.js"

const newGroupChat = async (req, res) => {
    try {
        const { name, member } = req.body

        if (member.length < 3) {
            return showError(res, "Group chat must have atleast 3 members")
        }

        const allMember = [...member, req.id]
        const newGroup = await Chat.create({
            name,
            groupChat: true,
            members: allMember,
            creator: req.id
        })

        return showResponse(res, {}, "New group has been created successfully")

    } catch (error) {
        showServerError(res)
    }
}

export { newGroupChat }