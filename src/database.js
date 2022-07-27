"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const URI = `mongodb+srv://julio:FlR2a08V4nwrQ2V0@cluster0.ei3ejos.mongodb.net/?retryWrites=true&w=majority`;
mongoose_1.default.set('debug', true);
mongoose_1.default
    .connect(URI)
    .then(() => console.log('db is up'))
    .catch((err) => console.log(err));
