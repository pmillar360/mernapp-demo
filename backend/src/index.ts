import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config"; // Import environment variables from .env file
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import path from 'path';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

// Create Express server
const app = express();

// Use cookie parser middleware
app.use(cookieParser());

// These are convenience middlewares that are used to parse the incoming request bodies in various ways.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.static(path.join(__dirname, "../../frontend/dist"))); // Serve the static files from the React app

// Define the route
app.use("/api/auth", authRoutes); // All routes in the authRoutes will be prefixed with /api/auth
app.use("/api/users", userRoutes); // All routes in the userRoutes will be prefixed with /api/users

// Start the Express server
app.listen(7000, () => {
    console.log("Server is running on port 7000");
});
