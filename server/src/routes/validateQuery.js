module.exports = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ message: "Validation error" });
    }
    req.query = result.data;
    next();
};