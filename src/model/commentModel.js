"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Comment = new mongoose_1.default.Schema({
    Post_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Post'
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
});
exports.default = mongoose_1.default.model('Comment', Comment);
