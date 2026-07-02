const express = require("express");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/auth");
const protectedRoutes = require("./src/routes/protected");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const { authLimiter, loginLimiter, apiLimiter } = require("./src/middleware/rateLimiter");
const csrfOriginCheck = require("./src/middleware/csrf");
const contactRouter = require("./src/routes/contact");
const { initSentry, Sentry } = require("./src/config/sentry.js");
const bookingRoutes = require("./src/routes/bookings");
const resourceRoutes = require("./src/routes/resources");
const serviceRoutes = require("./src/routes/services");

initSentry();

const app = express();

app.use(helmet());
app.disable("x-powered-by");
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

app.use(csrfOriginCheck);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1", apiLimiter);
app.use("/api/v1/auth", authLimiter);
app.use("/api/v1/auth/login", loginLimiter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", protectedRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use(Sentry.expressErrorHandler());

module.exports = app;