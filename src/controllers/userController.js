"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const postModel_1 = __importDefault(require("../model/postModel"));
const UploadImagesService_1 = __importDefault(require("../services/UploadImagesService"));
class UserController {
    register(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yup.object().shape({
                displayName: yup.string().required(),
                email: yup.string().required().email(),
                password: yup.string().required().min(6)
            });
            if (!(yield schema.isValid(request.body))) {
                return response.json({ error: true, message: 'Validation fails' });
            }
            const userExists = yield userModel_1.default.findOne({ email: request.body.email });
            if (userExists) {
                return response.json({ error: true, message: 'This user already exists' });
            }
            const user = yield userModel_1.default.create(request.body);
            return response.json({ user });
        });
    }
    session(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yup.object().shape({
                email: yup.string().email().required(),
                password: yup.string().required().min(6)
            });
            if (!schema) {
                return response.json({ error: true, message: 'Validation fails' });
            }
            const user = yield userModel_1.default.findOne({ email: request.body.email });
            if (!user) {
                return response.json({ error: true, message: 'User not found' });
            }
            const isValid = yield bcrypt_1.default.compare(request.body.password, user.password);
            if (!isValid) {
                return response.json({ error: true, message: 'This password is not valid' });
            }
            const accessToken = jsonwebtoken_1.default.sign({ user_id: user.id }, "mysecret", { expiresIn: '24h' });
            return response.json({ user, accessToken });
        });
    }
    updateImage(request, response) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ _id: request.params.id });
            /* if(user?.key){
                const deleteImageService = new DeleteImagesService();
                await deleteImageService.execute(user.key)
            } */
            if (request.file) {
                const uploadImagesService = new UploadImagesService_1.default();
                yield uploadImagesService.execute(request.file);
            }
            const newUser = yield userModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user.id, {
                fileName: (_a = request.file) === null || _a === void 0 ? void 0 : _a.filename,
                key: (_b = request.file) === null || _b === void 0 ? void 0 : _b.filename,
                fileUrl: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${(_c = request.file) === null || _c === void 0 ? void 0 : _c.filename}`
            });
            return response.json({ user: newUser });
        });
    }
    updateBody(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (request.body.userName) {
                const userExistis = yield userModel_1.default.findOne({ userName: request.body.userName });
                if (userExistis) {
                    return response.json({ error: true, message: "this username is already in use" });
                }
            }
            userModel_1.default.findByIdAndUpdate((_a = request.params) === null || _a === void 0 ? void 0 : _a.id, Object.assign({}, request.body)).then(() => __awaiter(this, void 0, void 0, function* () {
                const newuser = yield userModel_1.default.findOne({ _id: request.params.id });
                return response.json({ message: 'Done!', user: newuser });
            })).catch(() => {
                return response.json({ error: true, message: "An unexpected error occurred" });
            });
        });
    }
    users(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userModel_1.default.find().sort({ folowers: 1 });
            return response.json({ users });
        });
    }
    user(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ _id: request.params.id });
            if (!user) {
                return response.json({ error: true, message: 'User not found' });
            }
            const followers = yield userModel_1.default.find({ following: { $in: [user._id] } });
            return response.json({ user: Object.assign(Object.assign({}, user), { followers }) });
        });
    }
    posts(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield postModel_1.default.find({ user_id: request.params.id }).sort({ createdAt: -1 });
            return response.json({ posts });
        });
    }
    follow(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ _id: request.params.id });
            if (!user) {
                return response.json({ error: true, message: 'You need to login to follow users' });
            }
            yield userModel_1.default.findByIdAndUpdate(user._id, {
                following: [...user.following, request.body.target_id]
            }).then(() => __awaiter(this, void 0, void 0, function* () {
                const newuser = yield userModel_1.default.findOne({ _id: request.params.id });
                return response.json({ message: 'Done!', user: newuser });
            })).catch(() => {
                return response.json({ error: true, message: "An unexpected error occurred" });
            });
        });
    }
    unfollow(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ _id: request.params.id });
            if (!user) {
                return response.json({ error: true, message: 'You need to login to follow users' });
            }
            userModel_1.default.findByIdAndUpdate(user._id, {
                following: user.following.filter(e => e != request.body.target_id)
            }).then(() => __awaiter(this, void 0, void 0, function* () {
                const newuser = yield userModel_1.default.findOne({ _id: request.params.id });
                return response.json({ message: 'Done!', user: newuser });
            })).catch(() => {
                return response.json({ error: true, message: "An unexpected error occurred" });
            });
        });
    }
}
exports.default = new UserController();
