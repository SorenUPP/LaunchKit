function csrfOriginCheck(req, res, next) {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");

    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
        const origin = req.headers.origin;
        if (!origin || !allowedOrigins.includes(origin)) {
            return res.status(403).json({ message: "Forbidden" });
        }
    }

    next();
}

module.exports = csrfOriginCheck;