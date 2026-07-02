const { z } = require("zod");

const createBookingSchema = z.object({
    resourceId: z.string().min(1),
    serviceId: z.string().min(1),
    startTime: z.string().datetime(),
    customerEmail: z.string().email(),
    customerName: z.string().min(1).max(100),
});

const availabilityQuerySchema = z.object({
    resourceId: z.string().min(1),
    serviceId: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
});

module.exports = { createBookingSchema, availabilityQuerySchema };