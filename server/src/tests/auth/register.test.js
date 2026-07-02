const request = require("supertest");

jest.mock("../../firebaseAdmin", () => ({
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

jest.mock("../../middleware/csrf", () => (req, res, next) => next());
jest.mock("resend", () => ({
    Resend: jest.fn().mockImplementation(() => ({
        emails: {
            send: jest.fn().mockResolvedValue({ id: "mockemailid" }),
        },
    })),
}));

const app = require("../../../server");

const ORIGIN = "http://localhost:3000";

describe("POST /api/v1/auth/register", () => {
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .set("Origin", ORIGIN)
            .send({ email: `test${Date.now()}@test.com`, password: "password123" });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User registered successfully");
    });

    it("should fail with invalid email", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .set("Origin", ORIGIN)
            .send({ email: "notanemail", password: "password123" });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Validation error");
    });

    it("should fail with short password", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .set("Origin", ORIGIN)
            .send({ email: "test@test.com", password: "123" });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Validation error");
    });
});