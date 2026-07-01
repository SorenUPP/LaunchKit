const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "LaunchKit API",
            version: "1.0.0",
            description: "A fullstack authentication API",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
        paths: {
            "/api/v1/auth/register": {
                post: {
                    summary: "Register a new user",
                    tags: ["Auth"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        email: { type: "string", example: "user@example.com" },
                                        password: { type: "string", example: "password123" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: "User registered successfully" },
                        400: { description: "User already exists" },
                        500: { description: "Server error" },
                    },
                },
            },
            "/api/v1/auth/login": {
                post: {
                    summary: "Login and receive access token",
                    tags: ["Auth"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        email: { type: "string", example: "user@example.com" },
                                        password: { type: "string", example: "password123" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: "Returns access token" },
                        401: { description: "Invalid credentials" },
                        500: { description: "Server error" },
                    },
                },
            },
            "/api/v1/auth/refresh": {
                post: {
                    summary: "Refresh access token using cookie",
                    tags: ["Auth"],
                    responses: {
                        200: { description: "Returns new access token" },
                        401: { description: "No refresh token" },
                        403: { description: "Invalid refresh token" },
                    },
                },
            },
            "/api/v1/auth/logout": {
                post: {
                    summary: "Logout and clear refresh token cookie",
                    tags: ["Auth"],
                    responses: {
                        200: { description: "Logged out successfully" },
                    },
                },
            },
            "/api/v1/me": {
                get: {
                    summary: "Get authenticated user info",
                    tags: ["Protected"],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Returns user data" },
                        401: { description: "No token provided" },
                    },
                },
            },
            "/api/v1/admin": {
                get: {
                    summary: "Admin only route",
                    tags: ["Protected"],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Welcome admin" },
                        401: { description: "Not authenticated" },
                        403: { description: "Access denied" },
                    },
                },
            },
            "/api/v1/contact": {
                post: {
                    summary: "Send a contact message to the company",
                    tags: ["Contact"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        email: { type: "string", example: "customer@example.com" },
                                        subject: { type: "string", example: "Inquiry about your services" },
                                        message: { type: "string", example: "I would like to know more about your services." },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: "Message sent successfully" },
                        400: { description: "Validation error" },
                        429: { description: "Too many requests" },
                        500: { description: "Failed to send message" },
                    },
                },
            },
        },
    },
    apis: [],
};

module.exports = swaggerJsdoc(options);