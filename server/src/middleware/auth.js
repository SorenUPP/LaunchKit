const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

async function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findById(decoded.id);
        if(!user || user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ message: "Token invalidated"});
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = verifyToken;