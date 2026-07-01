const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const CACHE_TTL_MS = 30 * 1000;
const userCache = new Map(); // id -> { user, expiresAt }

async function getCachedUser(id) {
    const cached = userCache.get(id);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.user;
    }
    const user = await UserModel.findById(id);
    userCache.set(id, { user, expiresAt: Date.now() + CACHE_TTL_MS });
    return user;
}

async function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await getCachedUser(decoded.id);
        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ message: "Token invalidated" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = verifyToken;