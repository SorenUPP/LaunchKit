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

describe("POST /api/v1/auth/refresh", () => {
    it("should return 401 with no refresh token", async () => {
        const res = await request(app)
            .post("/api/v1/auth/refresh")
            .set("Origin", ORIGIN);
        expect(res.statusCode).toBe(401);
    });

    it("should return 403 with invalid refresh token", async () => {
        const res = await request(app)
            .post("/api/v1/auth/refresh")
            .set("Origin", ORIGIN)
            .set("Cookie", "refreshToken=invalidtoken");
        expect(res.statusCode).toBe(403);
    });
});