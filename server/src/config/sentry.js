const Sentry = require("@sentry/node");

function initSentry() {
    if (!process.env.SENTRY_DSN) return;

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || "development",
        tracesSampleRate: 0.2,
    });
}

module.exports = { Sentry, initSentry };