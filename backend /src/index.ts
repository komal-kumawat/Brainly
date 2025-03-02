import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Content, User } from "./db";
import bcrypt from "bcrypt";
import { userMiddleware } from "./middleware";
const app = express();
const port = 3000;
app.use(express.json());

app.post('/api/v1/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(403).json({ message: 'user already exists with this username' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username: username,
            password: hashedPassword
        })
        if (!user) {
            res.status(403).json({
                message: "error in inputs"
            })
        }
        res.json({
            message: "user signed up"
        })
    } catch (err) {
        res.status(500).json({
            message: "server error "
        })
    }
});

app.post('/api/v1/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(403).json({ message: "wrong email password" });
        }
        else {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(403).json({ message: "wrong  password" });

            }
            const token = jwt.sign({ userId: user._id }, "your_secret_key");

            res.status(200).json({ message: "sign-in successfuly", token });
        }



    } catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
});


app.post('/api/v1/content', userMiddleware, async (req: Request, res: Response) => {
    try {
        const { type, link, title, tags } = req.body;

        if (!type || !link || !title) {
            res.status(400).json({ message: "Missing required fields" });
        }

        //@ts-ignore
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
        }

        const content = await Content.create({
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

    } catch (err) {
        console.error("Error creating content:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/api/v1/content', userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await Content.find({ userId: userId }).populate("userId", "username");
    if (!content) {
        res.status(404).json({ message: "no contents available" });
    }
    else {
        res.json({ content });
    }
});

app.delete('/api/v1/content',userMiddleware, async (req, res) => {
    const {contentId} = req.body;
    await Content.deleteMany({
        _id:contentId,
        //@ts-ignore
        userId: req.userId
    }).then(()=>{
        res.json({ msg: "deleted successfully" })
    })
    res.status(403).json({msg:"trying to delete a doc that you dont own"});

});

app.post('/api/v1/brain/share', (req, res) => {

});
app.get('/api/v1/brain/:sharelink', (req, res) => {

});

app.listen(port, () => {
    console.log(`app listening to port ${port}`)
});