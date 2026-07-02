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

jest.mock("../middleware/csrf", () => (req, res, next) => next());
jest.mock("resend", () => ({
    Resend: jest.fn().mockImplementation(() => ({
        emails: {
            send: jest.fn().mockResolvedValue({ id: "mockemailid" }),
        },
    })),
}));

const app = require("../../server");

describe("Role enforcement", () => {
    it("should return 403 on /api/v1/admin with user role token", async () => {
        const token = jwt.sign(
            { id: "mockid", email: "user@test.com", role: "user", tokenVersion: 0 },
            process.env.JWT_SECRET || "testsecret",
            { expiresIn: "15m" }
        );
        const res = await request(app)
            .get("/api/v1/admin")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(403);
    });
});