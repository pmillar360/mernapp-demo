import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend the Request interface to add a userId property 
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth_token"]; // Get the token from the cookie

    if (!token) {
        return res.status(401).json({message: "Access denied"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string); // Decode the token

        req.userId = (decoded as JwtPayload).userId; // Add the user ID to the request object

        next();
    } catch (error) {
        return res.status(401).json({message: "Access denied"});
    }
}

export default verifyToken;