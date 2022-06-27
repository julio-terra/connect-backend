import mongoose from "mongoose";

const Post = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    displayText: String,
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