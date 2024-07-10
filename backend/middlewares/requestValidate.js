const ValidateRequest = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({ message: errors[0] });
    }
    req.body = value;
    next();
};


export default ValidateRequest