"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    if (!header) {
        res.status(401).json({ message: "Authorization header missing" });
    }
    const decoded = jsonwebtoken_1.default.verify(header, "your_secret_key");
    ;
    if (decoded) {
        //@ts-ignore 
        req.userId = decoded.userId;
        next();
    }
    else {
        res.status(403).json({
            message: "you are not logged in "
        });
    }
};
exports.userMiddleware = userMiddleware;
