const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
        
        if (error) {
            const formattedErrors = error.details.reduce((acc, err) => {
                acc[err.path[0]] = err.message;
                return acc;
            }, {});
            
            return res.status(400).json({
                message: Object.values(formattedErrors).join(', '),
                errors: formattedErrors
            });
        }
        
        req[property] = value;
        next();
    };
};

export { validateRequest };
