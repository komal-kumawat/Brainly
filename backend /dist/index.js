"use strict";
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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const existingUser = yield db_1.User.findOne({ username });
        if (existingUser) {
            res.status(403).json({ message: 'user already exists with this username' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield db_1.User.create({
            username: username,
            password: hashedPassword
        });
        if (!user) {
            res.status(403).json({
                message: "error in inputs"
            });
        }
        res.json({
            message: "user signed up"
        });
    }
    catch (err) {
        res.status(500).json({
            message: "server error "
        });
    }
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = yield db_1.User.findOne({ username });
        if (!user) {
            res.status(403).json({ message: "wrong email password" });
        }
        else {
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(403).json({ message: "wrong  password" });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, "your_secret_key");
            res.status(200).json({ message: "sign-in successfuly", token });
        }
    }
    catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
}));
app.post('/api/v1/content', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, link, title, tags } = req.body;
        if (!type || !link || !title) {
            res.status(400).json({ message: "Missing required fields" });
        }
        //@ts-ignore
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const content = yield db_1.Content.create({
            link,
            type,
            title,
            tags: tags || [], // Use provided tags or default to an empty array
            //@ts-ignore
            userId: req.userId,
        });
        res.status(201).json({
            message: "Content added successfully",
            content
        });
    }
    catch (err) {
        console.error("Error creating content:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.get('/api/v1/content', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const content = yield db_1.Content.find({ userId: userId }).populate("userId", "username");
    if (!content) {
        res.status(404).json({ message: "no contents available" });
    }
    else {
        res.json({ content });
    }
}));
app.delete('/api/v1/content', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentId } = req.body;
    yield db_1.Content.deleteMany({
        _id: contentId,
        //@ts-ignore
        userId: req.userId
    }).then(() => {
        res.json({ msg: "deleted successfully" });
    });
    res.status(403).json({ msg: "trying to delete a doc that you dont own" });
}));
app.post('/api/v1/brain/share', (req, res) => {
});
app.get('/api/v1/brain/:sharelink', (req, res) => {
});
app.listen(port, () => {
    console.log(`app listening to port ${port}`);
});
