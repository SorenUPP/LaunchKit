require("dotenv").config();
const app = require("./server.js");
const logger = require("./src/config/logger.js");
require("./src/config/env.js");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
})

function shutdown(signal) {
    logger.info(`${signal} recieved, shutting down gracefully`);
    server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
    });

    setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
    }, 10000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (err) => {
    logger.error("Uncaught exception", { error: err.message, stack: err.stack});
    shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
    logger.error("unhadled rejection", { reason: String(reason) });
    shutdown("unhandledRejection");
});