import Joi from 'joi';

const createOrderSchema = Joi.object({
    orderItems: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            qty: Joi.number().min(1).required(),
            image: Joi.string().required(),
            price: Joi.number().positive().required(),
            rentalDurationDays: Joi.number().min(1).required(),
            product: Joi.string().required(),
        })
    ).min(1).required().messages({
        'array.min': 'Order must contain at least one item',
        'any.required': 'Order items are required'
    }),
    shippingAddress: Joi.object({
        address: Joi.string().required().messages({ 'any.required': 'Street address is required' }),
        city: Joi.string().required().messages({ 'any.required': 'City is required' }),
        postalCode: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
            'string.length': 'Pincode must be exactly 6 digits',
            'string.pattern.base': 'Pincode can only contain numeric values',
            'any.required': 'Pincode is required'
        }),
        country: Joi.string().required().messages({ 'any.required': 'Country is required' }),
    }).required(),
    paymentMethod: Joi.string().required().messages({ 'any.required': 'Payment method is required' }),
    itemsPrice: Joi.number().positive().required(),
    taxPrice: Joi.number().min(0).required(),
    shippingPrice: Joi.number().min(0).required(),
    totalPrice: Joi.number().positive().required(),
});

export { createOrderSchema };
