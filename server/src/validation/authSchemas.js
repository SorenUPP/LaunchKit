const { z } = require("zod");

const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password must be at most 72 characters"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

module.exports = { registerSchema, loginSchema };