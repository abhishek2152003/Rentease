import * as yup from 'yup';

const phoneRegExp = /^[0-9]+$/;
const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = yup.object().shape({
    name: yup.string().min(3, 'Name must be at least 3 characters').matches(/^[A-Za-z\s]+$/, 'Name can only contain alphabets and spaces').required('Name is required'),
    email: yup.string().email('Please enter a valid email address with "@" and "."').required('Email is required'),
    phone: yup.string()
        .matches(phoneRegExp, 'Contact number can only contain numeric values')
        .max(10, 'Contact number can not be greater than 10 numbers')
        .required('Contact number is required'),
    password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(passwordRegExp, 'Password must contain uppercase, lowercase, number, and special character')
        .required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

export const loginSchema = yup.object().shape({
    email: yup.string().email('Please enter a valid email address').required('Email is required'),
    password: yup.string().required('Password is required'),
});

export const updateProfileSchema = yup.object().shape({
    name: yup.string().min(3, 'Name must be at least 3 characters').matches(/^[A-Za-z\s]+$/, 'Name can only contain alphabets and spaces').optional(),
    email: yup.string().email('Please enter a valid email address').optional(),
    phone: yup.string()
        .matches(phoneRegExp, 'Contact number can only contain numeric values')
        .max(10, 'Contact number can not be greater than 10 numbers')
        .optional(),
    password: yup.string()
        .test('empty-or-match', 'Password must contain uppercase, lowercase, number, and special character', value => {
            if (!value) return true;
            return passwordRegExp.test(value);
        })
        .test('min-length', 'Password must be at least 8 characters', value => {
            if (!value) return true;
            return value.length >= 8;
        }),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export const updateAddressSchema = yup.object().shape({
    addressLine: yup.string().required('Street Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    pincode: yup.string().matches(/^[0-9]*$/, 'Pincode must be numeric').max(6, 'Pincode cannot exceed 6 digits').required('Pincode is required')
});

export const reviewSchema = yup.object().shape({
    rating: yup.number().min(1).max(5).required('Rating is required'),
    comment: yup.string().min(5, 'Comment must be at least 5 characters').required('Comment is required')
});
