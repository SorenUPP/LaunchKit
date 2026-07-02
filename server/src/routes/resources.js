const express = require("express");
const router = express.Router();
const ResourceModel = require("../models/Resource");
const logger = require("../config/logger");

router.get("/", async (req, res) => {
    const { type } = req.query;
    if (!type) return res.status(400).json({ message: "Query param 'type' is required" });
    try {
        const resources = await ResourceModel.findByType(type);
        res.json(resources);
    } catch (error) {
        logger.error("Error fetching resources", { error: error.message, type });
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;