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

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ message: "API running" });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/auth", authLimiter);
app.use("api/auth/login", loginLimiter);
app.use(csrfOriginCheck);

module.exports = app;