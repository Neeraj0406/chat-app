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
        type: Types.ObjectId,
        ref: "User"
    },
    members: [
        {
            type: Types.ObjectId,
            ref: "User"
        }
    ]

}, {
    timestamps: true
})


export const Chat = mongoose.models.Chat || model("Chat", chatSchema)