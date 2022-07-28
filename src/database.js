"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const URI = `myuri`;
mongoose_1.default.set('debug', true);
mongoose_1.default
    .connect(URI)
    .then(() => console.log('db is up'))
    .catch((err) => console.log(err));
