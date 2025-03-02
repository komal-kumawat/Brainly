"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = exports.Link = exports.Tag = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb+srv://komalK:komal%40123@atlascluster.fukzabb.mongodb.net/brainly")
    .then(() => console.log("connected to mongodb"))
    .catch((err) => { console.error("error while connecting  to mongodb", err); });
// userSchema
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true, min: 3 },
    password: { type: String, required: true, min: 8 }
});
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
// tagschema
const tagSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, unique: true }
});
const Tag = mongoose_1.default.model('Tag', tagSchema);
exports.Tag = Tag;
// contentSchema 
const contentType = ['Audio', 'Video', 'Images', 'article'];
const contentSchema = new mongoose_1.default.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentType, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: Tag }],
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: User, required: true },
});
const Content = mongoose_1.default.model("Content", contentSchema);
exports.Content = Content;
// LinkSchema
const linkSchema = new mongoose_1.default.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: User, required: true },
});
const Link = mongoose_1.default.model("Link", linkSchema);
exports.Link = Link;
