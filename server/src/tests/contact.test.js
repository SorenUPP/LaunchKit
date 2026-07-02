const request = require("supertest");

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

describe("POST /api/v1/contact", () => {
    it("should send a contact mail message successfully", async () => {
        const res = await request(app)
            .post("/api/v1/contact")
            .send({ email: "test@test.com", subject: "Test Subject", message: "Test Message" });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Message sent successfully");
    });

    it("should fail with invalid email", async () => {
        const res = await request(app)
            .post("/api/v1/contact")
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
            .post("/api/v1/contact")
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
            .post("/api/v1/contact")
            .send({
                email: "customer@test.com",
                subject: "Test subject",
                message: "Too short",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Validation error");
    });
});