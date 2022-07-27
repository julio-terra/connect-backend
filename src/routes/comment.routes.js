"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const commentsController_1 = __importDefault(require("../controllers/commentsController"));
const multer_2 = __importDefault(require("../config/multer"));
const upload = (0, multer_1.default)(multer_2.default);
const Router = express_1.default.Router();
Router.post('/new', upload.single('file'), commentsController_1.default.new);
Router.get('/list/:post_id', commentsController_1.default.list);
Router.get('/comment/:id', commentsController_1.default.comment);
exports.default = Router;
