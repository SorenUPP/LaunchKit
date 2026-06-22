const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const { Timestamp } = require("firebase-admin/firestore");
const validate = require("./validate");
const { registerSchema, loginSchema } = require("../validation/authSchemas");
const router = express.Router();

// Registeration

router.post("/register", validate(registerSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            email,
            password: hashedPassword,
            role: "user",
            createdAt: Timestamp.now(),
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", validate(loginSchema), async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong Password" });
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d"}
        );

        //Storing the refresh token in http cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24* 60 * 60 * 1000,
        });


        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }
});

//Refresh
router.post("/refresh", (req, res) => {
     const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken, refreshToken });
    } catch(error) {
        return res.status(403).json({ message: "Invalid refresh token"});
    }
});

//Logout
router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
});

module.exports = router;