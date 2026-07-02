function toDateTime(dateStr, timeStr) {
    return new Date(`${dateStr}T${timeStr}:00.000Z`);
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
}

/**
 * businessHours: [{ start: "09:00", end: "17:00" }, ...] for the given weekday
 * existingBookings: [{ startTime: Date, endTime: Date }, ...]
 * date: "YYYY-MM-DD"
 * durationMinutes / bufferMinutes: from the service being booked
 * stepMinutes: granularity of candidate start times (default: every 15 min)
 */
function computeAvailableSlots({
    businessHours,
    existingBookings,
    date,
    durationMinutes,
    bufferMinutes = 0,
    stepMinutes = 15,
    now = new Date(),
}) {
    const totalBlockMs = (durationMinutes + bufferMinutes) * 60000;
    const stepMs = stepMinutes * 60000;
    const slots = [];

    for (const window of businessHours) {
        const windowStart = toDateTime(date, window.start);
        const windowEnd = toDateTime(date, window.end);

        for (
            let candidateStart = windowStart;
            candidateStart.getTime() + totalBlockMs <= windowEnd.getTime();
            candidateStart = new Date(candidateStart.getTime() + stepMs)
        ) {
            if (candidateStart < now) continue;

            const candidateEnd = new Date(candidateStart.getTime() + totalBlockMs);
            const hasConflict = existingBookings.some((b) =>
                rangesOverlap(candidateStart, candidateEnd, b.startTime, b.endTime)
            );

            if (!hasConflict) {
                slots.push(candidateStart.toISOString());
            }
        }
    }

    return slots;
}

module.exports = { computeAvailableSlots, rangesOverlap };