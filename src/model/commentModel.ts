import mongoose from 'mongoose';

const Comment = new mongoose.Schema({
    displayText: String,
    userFileUrl: String,
    userName: String,
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Post_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export default mongoose.model('Comment', Comment)