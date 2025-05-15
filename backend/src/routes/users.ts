import express, {Request, Response} from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select("-password"); // Exclude the password from the query

        if (!user) {
            res.status(404).json({message: "User not found"});
            return;
        }

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
});

// Register a new user in the database, throw an error if the user already exists
router.post("/register", [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password is required and must be at least 6 characters").isLength({min: 6}),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);

    // If there are validation errors, return them
    if (!errors.isEmpty()) {
        res.status(400).json({message: errors.array()});
        return;
    }

    try {
        //Check if user already exists in the database
        let user = await User.findOne({
            email: req.body.email,
        });

        //If user exists, return an error
        if (user) {
            res.status(400).json({message: "User already exists"});
            return;
        }

        //Create a new user instance
        user = new User(req.body);

        //Save the user to the database
        await user.save();

        //Encrypt the password
        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET_KEY as string, {
                expiresIn: "1d",
            }
        );

        //Send the token in a cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use HTTPS in production
            maxAge: 86400000, // 1 day
        })

        const userEmail = req.body.email;

        // Send a success message to the client
        res.status(200).send({message: `User ${userEmail} registered successfully`});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"});
    }
});

export default router;