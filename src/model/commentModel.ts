import mongoose from 'mongoose';

const Comment = new mongoose.Schema({
    Post_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    displayText: String,
    fileName: String,
    fileSize: Number,
    key: String,
    fileUrl: String,
    likes: [String]
})

export default mongoose.model('Comment', Comment)