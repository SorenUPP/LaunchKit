const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

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
            "/api/auth/register": {
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
            "/api/auth/login": {
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
            "/api/auth/refresh": {
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
            "/api/auth/logout": {
                post: {
                    summary: "Logout and clear refresh token cookie",
                    tags: ["Auth"],
                    responses: {
                        200: { description: "Logged out successfully" },
                    },
                },
            },
            "/api/me": {
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
            "/api/admin": {
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
        },
    },
    apis: [],
};

module.exports = swaggerJsdoc(options);