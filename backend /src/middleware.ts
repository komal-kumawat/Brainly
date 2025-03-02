import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    if (!header) {
         res.status(401).json({ message: "Authorization header missing" });
    }


    const decoded = jwt.verify(header as string,"your_secret_key")as { userId: string };
    ;
    if(decoded){
        //@ts-ignore 
        req.userId = decoded.userId;
        next();
    }
    else{
        res.status(403).json({
            message:"you are not logged in "
        })
    }
}