import express, {Request, Response} from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.post("/login", [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").exists(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.array()});
    }

    const {email, password} = req.body; // Destructure email and password from the request body

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        // Create a JWT token
        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET_KEY as string,
            {expiresIn: "1d"},
        );

        // Send the token in a cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use HTTPS in production
            maxAge: 86400000,
        });

        // Send the user ID in the response
        res.status(200).json({userId: user.id});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"});
    }
});

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
    res.status(200).send({userId: req.userId});
})

// Invalid token error is thrown when logging out
router.post("/logout", (req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0), // Expire the cookie
    });

    res.send();
});

export default router;