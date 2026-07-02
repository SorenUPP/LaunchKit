const express = require("express");
const router = express.Router();
const ServiceModel = require("../models/Service");
const logger = require("../config/logger");

router.get("/", async (req, res) => {
    try {
        const services = await ServiceModel.findAll();
        res.json(services);
    } catch (error) {
        logger.error("Error fetching services", { error: error.message });
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;