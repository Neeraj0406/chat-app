import { Schema, model, models } from "mongoose"

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    username: {
        type: String,
        required: [true, "Please enter username"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
}, {
    timestamps: true
})


export const User = models.User || model("User", userSchema)