const express = require("express");
const validate = require("../middleware/validate");
const { contactSchema } = require("../validation/authSchemas");
const { contactLimiter } = require("../middleware/rateLimiter");
const { sendContactEmail } = require("../config/mailer");
const router = express.Router();
const logger = require("../config/logger");

router.post("/", contactLimiter, validate(contactSchema), async (req, res) => {
    const {email, subject, message } = req.body;

    try {
        await sendContactEmail({ email, subject, message });
        logger.info("Contact email sent", { from: email, subject });
        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        logger.error("Failed to send contact email", { error: error.message, from: email });
        res.status(500).json({ message: "Failed to send message" });
    }
});

module.exports = router;