const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const { Timestamp } = require("firebase-admin/firestore");
const validate = require("./validate");
const { registerSchema, loginSchema } = require("../validation/authSchemas");
const router = express.Router();
const logger = require("../config/logger");

// Registeration
router.post("/register", validate(registerSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await UserModel.create({
            email,
            password: hashedPassword,
            role: "user",
            createdAt: Timestamp.now(),
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
       logger.error("Error during registration:", { error: error.message, email});
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", validate(loginSchema), async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const user = await UserModel.findByEmail(email);
        const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8r6h1Z5e1F5Q5e1F5Q5e1F5Q5e1F5Q5e";
        
        const isMatch = user
        ? await bcrypt.compare(password, user.password)
        : await bcrypt.compare(password, DUMMY_HASH);
        

        if (!user || !isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role, tokenVersion: user.tokenVersion},
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d"}
        );

       

        await UserModel.saveRefreshToken(user.id, refreshToken);
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24* 60 * 60 * 1000,
        });


        res.json({ accessToken });
    } catch (error) {
        logger.error("Login error", { error: error.message, email });
        res.status(500).json({ message: "Server error"});
    }
});

//Refresh
router.post("/refresh", async (req, res) => {
     const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const storedToken = await UserModel.getRefreshToken(decoded.id);
        if (!storedToken || storedToken !== token) {
            return res.status(403).json({ message: "Invalid refresh token" });  
        }

        const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken });
    } catch(error) {
        return res.status(403).json({ message: "Invalid refresh token"});
    }
});

//Logout
router.post("/logout", async (req, res) => {
    const token = req.cookies.refreshToken;

    if (token) {
        try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await UserModel.deleteRefreshToken(decoded.id);
    } catch (_) {
        //already invalid, still clear the cookie
    }
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
});

module.exports = router;