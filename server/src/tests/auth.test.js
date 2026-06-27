const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../firebaseAdmin", () => ({
    db: {
        collection: () => ({
            where: () => ({
                limit: () => ({
                    get: jest.fn().mockResolvedValue({ empty: true, docs: [] })
                })
            }),
            add: jest.fn().mockResolvedValue({ id: "mockid123" }),
            doc: () => ({
                get: jest.fn().mockResolvedValue({
                    exists: true,
                    id: "mockid",
                    data: () => ({ email: "user@test.com", role: "user", tokenVersion: 0 })
                }),
                set: jest.fn().mockResolvedValue({}),
                delete: jest.fn().mockResolvedValue({}),
            }),
        })
    }
}));

// Mock CSRF so it doesn't block test requests
jest.mock("../middleware/csrf", () => (req, res, next) => next());
jest.mock("resend", () => {
    return {
        Resend: jest.fn().mockImplementation(() => ({
            emails: {
                send: jest.fn().mockResolvedValue({ id: "mockemailid" }),
            },
        })),
    };
});

const app = require("../../server");

const ORIGIN = "http://localhost:3000";

// REGISTER
describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .set("Origin", ORIGIN)
            .send({ email: `test${Date.now()}@test.com`, password: "password123" });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User registered successfully");
    });

    it("should fail with invalid email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .set("Origin", ORIGIN)
            .send({ email: "notanemail", password: "password123" });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Validation error");
    });

    it("should fail with short password", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .set("Origin", ORIGIN)
            .send({ email: "test@test.com", password: "123" });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Validation error");
    });
});

// LOGIN
describe("POST /api/auth/login", () => {
    it("should fail with non existent user", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .set("Origin", ORIGIN)
            .send({ email: "nobody@test.com", password: "password123" });

        expect(res.statusCode).toBe(401);
    });

    it("should fail with wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .set("Origin", ORIGIN)
            .send({ email: "test@test.com", password: "wrongpassword" });

        expect(res.statusCode).toBe(401);
    });
});

// PROTECTED
describe("GET /api/me", () => {
    it("should return 401 with no token", async () => {
        const res = await request(app).get("/api/me");
        expect(res.statusCode).toBe(401);
    });
});

// ADMIN
describe("GET /api/admin", () => {
    it("should return 401 with no token", async () => {
        const res = await request(app).get("/api/admin");
        expect(res.statusCode).toBe(401);
    });
});

// REFRESH
describe("POST /api/auth/refresh", () => {
    it("should return 401 with no refresh token", async () => {
        const res = await request(app)
            .post("/api/auth/refresh")
            .set("Origin", ORIGIN);
        expect(res.statusCode).toBe(401);
    });

    it("should return 403 with invalid refresh token", async () => {
        const res = await request(app)
            .post("/api/auth/refresh")
            .set("Origin", ORIGIN)
            .set("Cookie", "refreshToken=invalidtoken");
        expect(res.statusCode).toBe(403);
    });
});

// LOGOUT
describe("POST /api/auth/logout", () => {
    it("should clear the refresh token cookie and return 200", async () => {
        const res = await request(app)
            .post("/api/auth/logout")
            .set("Origin", ORIGIN);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logged out successfully");
    });
});

// ROLE ENFORCEMENT
describe("Role enforcement", () => {
    it("should return 403 on /api/admin with user role token", async () => {
        const token = jwt.sign(
            { id: "mockid", email: "user@test.com", role: "user", tokenVersion: 0 },
            process.env.JWT_SECRET || "testsecret",
            { expiresIn: "15m" }
        );
        const res = await request(app)
            .get("/api/admin")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(403);
    });
});

// CONTACT
describe("POST /api/contact", () => {
    it("should send a contact mail message successfully", async () => {
        const res = await request(app)
        .post("/api/contact")
        .send({ email: "test@test.com", subject: "Test Subject", message: "Test Message" });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Message sent successfully");
    });

    it("should fail with invalid email", async () => {
        const res = await request(app)
            .post("/api/contact")
            .send({
                email: "notanemail",
                subject: "Test subject",
                message: "This is a test message from a customer.",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Validation error");
    });

    it("should fail with missing subject", async () => {
        const res = await request(app)
            .post("/api/contact")
            .send({
                email: "customer@test.com",
                subject: "",
                message: "This is a test message from a customer.",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Validation error");
    });

    it("should fail with message too short", async () => {
        const res = await request(app)
            .post("/api/contact")
            .send({
                email: "customer@test.com",
                subject: "Test subject",
                message: "Too short",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Validation error");
    });
});
