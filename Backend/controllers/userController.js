import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json(
                {
                    message: "All fields are required"

                }
            );
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json(
                {
                    message: "Email already registered"

                });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user._id);

        res.cookie("token", token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

        res.status(201).json(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
            });
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message

            });
    }
};



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(
                {
                    message: "Email and password are required"

                });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json(
                {
                    message: "Invalid email or password"

                });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json(
                {
                    message: "Invalid email or password"

                });
        }

        const token = generateToken(user._id);
        res.cookie("token", token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        res.status(200).json(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
            });
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message

            });
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.status(200).json(
        {
            message: "Logged out successfully"

        });
};


export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json(
                {
                    message: "User not found"

                });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(
            {
                message: "Server error", error: error.message

            });
    }
};