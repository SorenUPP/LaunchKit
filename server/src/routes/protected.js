const express = require("express");
const verifyToken = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

router.get("/me", verifyToken, (req, res) => {
    const { id, email, role } = req.user;
    res.json({ message: "You are authenticated", user: { id, email, role } });
});

router.get("/admin", verifyToken, requireRole("admin"), (req, res) => {
    const { id, email, role } = req.user;
    res.json({ message: "Welcome admin", user: { id, email, role } });
});

module.exports = router;