import mongoose, { Schema, model } from "mongoose"

const chatSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    groupChat: {
        type: Boolean,
        default: false
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    lastMessage: String,
    avatar: {
        public_id: String,
        url: String
    }

}, {
    timestamps: true
})


export const Chat = mongoose.models.Chat || model("Chat", chatSchema)