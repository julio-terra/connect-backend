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
const postModel_1 = __importDefault(require("../model/postModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const UploadImagesService_1 = __importDefault(require("../services/UploadImagesService"));
class PostController {
    new(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yup.object().shape({
                user_id: yup.string().required(),
                displayText: yup.string()
            });
            if (!(yield schema.isValid(request.body))) {
                return response.json({ error: true, message: 'Error' });
            }
            if (!request.body.displayText && !request.file) {
                return response.json({ error: true, message: 'the fields were not filld' });
            }
            if (!request.file) {
                yield postModel_1.default.create(Object.assign({}, request.body));
                return response.json({ message: 'Done' });
            }
            if (request.file) {
                const uploadImagesService = new UploadImagesService_1.default();
                yield uploadImagesService.execute(request.file);
                yield postModel_1.default.create(Object.assign(Object.assign({}, request.body), { fileName: request.file.filename, key: request.file.filename, fileUrl: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${(_a = request.file) === null || _a === void 0 ? void 0 : _a.filename}` })).then(() => {
                    return response.json({ message: 'Done!' });
                }).catch(() => {
                    return response.json({ error: true, message: 'An unexpected error occurred' });
                });
            }
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postModel_1.default.findOne({ _id: request.params.id });
            if (!post) {
                return response.json({ error: true, message: 'this post has already been deleted' });
            }
            /* if(post.key){
                const deleteImageService = new DeleteImagesService();
                await deleteImageService.execute(post.key)
            } */
            post.remove().then(() => {
                return response.json({ message: 'Done!' });
            }).catch(() => {
                return response.json({ error: true, message: 'An unexpected error occurred' });
            });
        });
    }
    list(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ _id: request.params.user_id });
            const posts = yield postModel_1.default.find({ user_id: { $in: user === null || user === void 0 ? void 0 : user.following } }).sort({ createdAt: -1 });
            return response.json({ posts });
        });
    }
    post(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postModel_1.default.findOne({ _id: request.params.id });
            return response.json({ post });
        });
    }
}
exports.default = new PostController();
