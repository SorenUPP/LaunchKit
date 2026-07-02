const { db } = require("../firebaseAdmin");
const { Timestamp } = require("firebase-admin/firestore");
const bookingCollection = db.collection("bookings");

const dayBoundsUTC = (dateOrString) => {
    const start = new Date(dateOrString);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCHours(23, 59, 59, 999);
    return { start, end };
};

const BookingModel = {
    findByResourceAndDate: async (resourceId, date) => {
        const { start, end } = dayBoundsUTC(`${date}T00:00:00.000Z`);

        const snapshot = await bookingCollection
            .where("resourceId", "==", resourceId)
            .where("status", "==", "confirmed")
            .where("startTime", ">=", Timestamp.fromDate(start))
            .where("startTime", "<=", Timestamp.fromDate(end))
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return { id: doc.id, ...data, startTime: data.startTime.toDate(), endTime: data.endTime.toDate() };
        });
    },

    // Runs the overlap check and the write inside one Firestore transaction,
    // so two concurrent requests for the same slot can't both succeed.
    createWithOverlapCheck: async ({ resourceId, serviceId, startTime, endTime, customerEmail, customerName }) => {
        return db.runTransaction(async (transaction) => {
            const { start, end } = dayBoundsUTC(startTime);

            const snapshot = await transaction.get(
                bookingCollection
                    .where("resourceId", "==", resourceId)
                    .where("status", "==", "confirmed")
                    .where("startTime", ">=", Timestamp.fromDate(start))
                    .where("startTime", "<=", Timestamp.fromDate(end))
            );

            const hasConflict = snapshot.docs.some((doc) => {
                const existing = doc.data();
                const existingStart = existing.startTime.toDate();
                const existingEnd = existing.endTime.toDate();
                return startTime < existingEnd && existingStart < endTime;
            });

            if (hasConflict) {
                throw new Error("SLOT_TAKEN");
            }

            const newRef = bookingCollection.doc();
            transaction.set(newRef, {
                resourceId,
                serviceId,
                startTime: Timestamp.fromDate(startTime),
                endTime: Timestamp.fromDate(endTime),
                customerEmail,
                customerName,
                status: "confirmed",
                createdAt: Timestamp.now(),
            });

            return newRef.id;
        });
    },

    findById: async (id) => {
        const doc = await bookingCollection.doc(id).get();
        if (!doc.exists) return null;
        const data = doc.data();
        return { id: doc.id, ...data, startTime: data.startTime.toDate(), endTime: data.endTime.toDate() };
    },

    cancel: async (id) => {
        await bookingCollection.doc(id).update({ status: "cancelled" });
    },
};

module.exports = BookingModel;