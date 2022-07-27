"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = __importDefault(require("../controllers/postController"));
const multer_1 = __importDefault(require("multer"));
const multer_2 = __importDefault(require("../config/multer"));
const upload = (0, multer_1.default)(multer_2.default);
const Router = express_1.default.Router();
Router.post('/new', upload.single('file'), postController_1.default.new);
Router.delete('/delete/:id', postController_1.default.delete);
Router.get('/list/:user_id', postController_1.default.list);
Router.get('/post/:id', postController_1.default.post);
exports.default = Router;
