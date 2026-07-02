const express = require("express");
const router = express.Router();
const validate = require("./validate");
const validateQuery = require("./validateQuery");
const { availabilityQuerySchema, createBookingSchema } = require("../validation/bookingSchemas");
const ResourceModel = require("../models/Resource");
const ServiceModel = require("../models/Service");
const BookingModel = require("../models/Booking");
const { computeAvailableSlots } = require("../utils/availability");
const logger = require("../config/logger");

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

router.get("/availability", validateQuery(availabilityQuerySchema), async (req, res) => {
    const { resourceId, serviceId, date } = req.query;
    try {
        const resource = await ResourceModel.findById(resourceId);
        if (!resource) return res.status(404).json({ message: "Resource not found" });

        const service = await ServiceModel.findById(serviceId);
        if (!service) return res.status(404).json({ message: "Service not found" });

        const weekday = WEEKDAYS[new Date(`${date}T00:00:00.000Z`).getUTCDay()];
        const businessHours = resource.businessHours?.[weekday] || [];
        const existingBookings = await BookingModel.findByResourceAndDate(resourceId, date);

        const slots = computeAvailableSlots({
            businessHours,
            existingBookings,
            date,
            durationMinutes: service.durationMinutes,
            bufferMinutes: service.bufferMinutes || 0,
        });

        res.json({ slots });
    } catch (error) {
        logger.error("Error computing availability", { error: error.message, resourceId, serviceId, date });
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", validate(createBookingSchema), async (req, res) => {
    const { resourceId, serviceId, startTime, customerEmail, customerName } = req.body;
    try {
        const resource = await ResourceModel.findById(resourceId);
        if (!resource) return res.status(404).json({ message: "Resource not found" });

        const service = await ServiceModel.findById(serviceId);
        if (!service) return res.status(404).json({ message: "Service not found" });

        const start = new Date(startTime);
        if (start < new Date()) {
            return res.status(400).json({ message: "Cannot book a time in the past" });
        }

        const totalMinutes = service.durationMinutes + (service.bufferMinutes || 0);
        const end = new Date(start.getTime() + totalMinutes * 60000);

        const bookingId = await BookingModel.createWithOverlapCheck({
            resourceId, serviceId, startTime: start, endTime: end, customerEmail, customerName,
        });

        res.status(201).json({ message: "Booking confirmed", bookingId });
    } catch (error) {
        if (error.message === "SLOT_TAKEN") {
            return res.status(409).json({ message: "This time slot is no longer available" });
        }
        logger.error("Error creating booking", { error: error.message, resourceId, serviceId, startTime });
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const booking = await BookingModel.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        res.json(booking);
    } catch (error) {
        logger.error("Error fetching booking", { error: error.message, bookingId: req.params.id });
        res.status(500).json({ message: "Server error" });
    }
});

router.patch("/:id/cancel", async (req, res) => {
    try {
        const booking = await BookingModel.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        await BookingModel.cancel(req.params.id);
        res.json({ message: "Booking cancelled" });
    } catch (error) {
        logger.error("Error cancelling booking", { error: error.message, bookingId: req.params.id });
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;