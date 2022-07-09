import mongoose from "mongoose";

const Post = new mongoose.Schema({
    displayText: String,
    userFileUrl: String,
    userName: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    fileName: String,
    fileSize: Number,
    key: String,
    fileUrl: String,
})

export default mongoose.model('Post', Post);