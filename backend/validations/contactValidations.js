import Joi from 'joi';

const contactFormSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
    }),
    subject: Joi.string().required().messages({
        'any.required': 'Subject is required'
    }),
    message: Joi.string().min(10).required().messages({
        'string.min': 'Message must be at least 10 characters',
        'any.required': 'Message is required'
    })
});

export { contactFormSchema };
