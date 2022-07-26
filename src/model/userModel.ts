import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const User = new mongoose.Schema({
    displayName: String,
    userName: String,
    email: String,
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    fileName: String,
    key: String,
    fileUrl: {
        type: String,
        default: "https://www.promoview.com.br/uploads/images/unnamed%2819%29.png"
    },
    following:{
        type: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }],
        required: true,
        default: []
    }
})

User.pre('save', function(next){
    const user = this;
    if(user.password){
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
    }
    next()
})
export default mongoose.model('User', User);