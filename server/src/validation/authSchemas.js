const { z } = require("zod");

const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password must be at most 72 characters"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

const contactSchema = z.object({
    email: z.string().email("Invalid email"),
    subject: z.string().min(2, "Subject too short").max(100, "Subject too long"),
    message: z.string().min(10, "Message too short").max(1000, "Message too long"),
});

module.exports = { registerSchema, loginSchema, contactSchema };