import mongoose, { Schema, model } from "mongoose"

const requestSchema = new Schema({
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"]
    },

}, {
    timestamps: true
})


export const Request = mongoose.models.Request || model("Request", requestSchema)