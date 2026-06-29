const { parse } = require("dotenv");
const { z } = require("zod");

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.string().default("5000"),
    JWT_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    FIREBASE_PROJECT_ID: z.string().min(1),
    FIREBASE_CLIENT_EMAIL: z.string().min(1),
    FIREBASE_PRIVATE_KEY: z.string().min(1),
    ALLOWED_ORIGINS: z.string().min(1),
    BCRYPT_ROUNDS: z.string().default("12"),
    RESEND_API_KEY: z.string().min(1),
    CONTACT_EMAIL: z.string().email(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(" Invalid enviorment variables");
    parsed.error.errors.forEach(err => {
        console.error(`   ${err.path.join(".")}; ${err.message}`);
    });
    process.exit(1);
}

module.exports = parsed.data;