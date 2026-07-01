const { parse } = require("dotenv");
const { z } = require("zod");

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.string().default("5000"),
    JWT_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    FIREBASE_SERVICE_ACCOUNT: z.string().min(1),
    ALLOWED_ORIGINS: z.string().optional(),
    BCRYPT_ROUNDS: z.string().default("12"),
    RESEND_API_KEY: z.string().min(1),
    COMPANY_EMAIL: z.string().email(),
    SENTRY_DSN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(" Invalid environment variables:");
    const errors = parsed.error.flatten().fieldErrors;
    Object.entries(errors).forEach(([key, messages]) => {
        console.error(`   ${key}: ${messages.join(", ")}`);
    });
    process.exit(1);
}

module.exports = parsed.data;