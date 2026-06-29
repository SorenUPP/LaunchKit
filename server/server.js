const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/auth");
const protectedRoutes = require("./src/routes/protected");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const { authLimiter, loginLimiter } = require("./src/middleware/rateLimiter");
const csrfOriginCheck = require("./src/middleware/csrf");
const contactRouter = require("./src/routes/contact");
const { initSentry, Sentry } = require("./src/config/sentry.js");
initSentry();

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:3000",
    credentials: true
}));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.set("trust proxy", 1);

app.get("/", (req, res) => {
    res.json({ message: "API running" });
});
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

if (process.env.NODE_ENV !== "production") {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.use("/api/contact", contactRouter); 
app.use(csrfOriginCheck);
app.use("/api/auth", authLimiter);
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use(Sentry.expressErrorHandler());
module.exports = app;