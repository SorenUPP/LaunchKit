function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: result.error?.issues?.map(e => ({
                    field: e.path[0],
                    message: e.message,
                })) || [],
            });
        }

        req.body = result.data;
        next();
    };
}

module.exports = validate;