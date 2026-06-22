const express = require("express");
const verifyToken = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

router.get("/me", verifyToken, (req, res) => {
    res.json({ message: "You are authenticated", user: req.user});
});

router.get("/admin", verifyToken, requireRole("admin"), (req, res) => {
    res.json({ message: "Welcome admin", user: req.user});
});

module.exports = router;