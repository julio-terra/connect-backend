"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User = new mongoose_1.default.Schema({
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
    following: {
        type: [{
                type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User'
            }],
        required: true,
        default: []
    }
});
User.pre('save', function (next) {
    const user = this;
    if (user.password) {
        const salt = bcrypt_1.default.genSaltSync(10);
        user.password = bcrypt_1.default.hashSync(user.password, salt);
    }
    next();
});
exports.default = mongoose_1.default.model('User', User);
