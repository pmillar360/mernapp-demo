import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User model is used to store user information in the database.
 */

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

// Define the schema for the user model
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    next();
})

// Create a model for the user schema
const User = mongoose.model<UserType>('User', userSchema);

export default User;