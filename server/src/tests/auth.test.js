const request = require("supertest");

// Mock firebase-admin before importing app
jest.mock("../firebaseAdmin", () => ({
    db: {
        collection: () => ({
            where: () => ({
                limit: () => ({
                    get: jest.fn().mockResolvedValue({ empty: true, docs: [] })
                })
            }),
            add: jest.fn().mockResolvedValue({ id: "mockid123" })
        })
    }
}));

const app = require("../../server");

// REGISTER
describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: `test${Date.now()}@test.com`, password: "password123" });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User registered successfully");
    });

    it("should fail with invalid email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "notanemail", password: "password123" });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Validation error");
    });

    it("should fail with short password", async () => {
        const res = await request(app)
            .post("/api/auth/register")
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
            .send({ email: "nobody@test.com", password: "password123" });

        expect(res.statusCode).toBe(401);
    });

    it("should fail with wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
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