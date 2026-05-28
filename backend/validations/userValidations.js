import Joi from 'joi';

const registerSchema = Joi.object({
    name: Joi.string().min(3).pattern(/^[A-Za-z\s]+$/).required().messages({
        'string.min': 'Name must be at least 3 characters',
        'string.pattern.base': 'Name can only contain alphabets and spaces',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }).required().messages({
        'string.email': 'Please enter a valid email address with "@" and "."',
        'any.required': 'Email is required'
    }),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'Password is required'
        }),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'Contact number must be exactly 10 digits',
        'string.pattern.base': 'Contact number can only contain numeric values',
        'any.required': 'Contact number is required'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

const updateProfileSchema = Joi.object({
    name: Joi.string().min(3).pattern(/^[A-Za-z\s]+$/).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).optional(),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .optional()
        .allow(''),
    address: Joi.object({
        addressLine: Joi.string().optional().allow(''),
        city: Joi.string().optional().allow(''),
        state: Joi.string().optional().allow(''),
        pincode: Joi.string().length(6).pattern(/^[0-9]+$/).optional().allow(''),
    }).optional()
});

export { registerSchema, loginSchema, updateProfileSchema };
