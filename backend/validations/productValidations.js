import Joi from 'joi';

const createProductSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Product name is required'
    }),
    images: Joi.array().items(Joi.string()).min(1).required().messages({
        'array.min': 'At least one product image is required',
        'any.required': 'Product image is required'
    }),
    category: Joi.string().required().messages({
        'any.required': 'Category is required'
    }),
    description: Joi.string().min(20).required().messages({
        'string.min': 'Description must be at least 20 characters',
        'any.required': 'Description is required'
    }),
    priceDaily: Joi.number().positive().required().messages({
        'number.positive': 'Price must be a positive number',
        'any.required': 'Daily price is required'
    }),
    priceMonthly: Joi.number().positive().required().messages({
        'number.positive': 'Price must be a positive number',
        'any.required': 'Monthly price is required'
    }),
    stock: Joi.number().min(0).required().messages({
        'number.min': 'Stock quantity cannot be negative',
        'any.required': 'Stock is required'
    })
});

const updateProductSchema = createProductSchema.fork(
    Object.keys(createProductSchema.describe().keys),
    (schema) => schema.optional()
);

const reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
        'number.min': 'Rating is required',
        'number.max': 'Rating cannot be more than 5',
        'any.required': 'Rating is required'
    }),
    comment: Joi.string().min(5).required().messages({
        'string.min': 'Comment must be at least 5 characters',
        'any.required': 'Comment is required'
    })
});

export { createProductSchema, updateProductSchema, reviewSchema };
