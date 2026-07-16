import Joi from "joi";
import { NODE_ENV } from "../util/env.util.js";
import { isCorporateEmail } from "../util/auth.util.js";

export const registerSchema = Joi.object({
    name: Joi.string()
    .min(3)
    .max(60)
    .required()
    .messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name should have a minimum length of {#limit}',
        'string.max': 'Name should have a maximum length of {#limit}',
        'any.required': 'Name is required',
    }),
    email: Joi.string()
    .email()
    .required()
    .messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    })
    .custom((value, helpers) => {
        if (NODE_ENV === 'production' && !isCorporateEmail(value)) {
            return helpers.message({ custom: 'Registration requires an official corporate/office email domain.' });
        }
        return value;
    }),
    password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password should have a minimum length of {#limit}',
        'string.max': 'Password should have a maximum length of {#limit}',
        'any.required': 'Password is required',
    }),
    confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
        'string.base': 'Confirm Password must be a string',
        'string.empty': 'Confirm Password is required',
        'any.only': 'Confirm Password does not match',
        'any.required': 'Confirm Password is required',
    }),
    phoneInformation: Joi.object({
        countryCode: Joi
        .string()
        .min(1)
        .max(5)
        .required()
        .messages({
            'string.base': 'Country Code must be a string',
            'string.empty': 'Country Code is required',
            'string.min': 'Country Code should have a minimum length of {#limit}',
            'string.max': 'Country Code should have a maximum length of {#limit}',
            'any.required': 'Country Code is required',
        }),
        phoneNumber: Joi
        .string()
        .min(5)
        .max(15)
        .required()
        .messages({
            'string.base': 'Phone Number must be a string',
            'string.empty': 'Phone Number is required',
            'string.min': 'Phone Number should have a minimum length of {#limit}',
            'string.max': 'Phone Number should have a maximum length of {#limit}',
            'any.required': 'Phone Number is required',
        }),
    })
    .required()
    .messages({
        'object.base': 'Phone Information must be an object',
        'object.empty': 'Phone Information is required',
        'any.required': 'Phone Information is required',
    }),
})

export const loginSchema = Joi.object({
    email: Joi.string()
    .email()
    .required()
    .messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    })
    .custom((value, helpers) => {
        if (NODE_ENV === 'production' && !isCorporateEmail(value)) {
            return helpers.message({ custom: 'Registration requires an official corporate/office email domain.' });
        }
        return value;
    }),
    password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password should have a minimum length of {#limit}',
        'string.max': 'Password should have a maximum length of {#limit}',
        'any.required': 'Password is required',
    }),
})

export const registerOTPCodeSchema = Joi.object({
    otpCode: Joi.string()
    .length(6)
    .required()
    .messages({
        'string.base': 'OTP Code must be a string',
        'string.empty': 'OTP Code is required',
        'string.length': 'OTP Code must be exactly {#limit} characters',
        'any.required': 'OTP Code is required',
    }),
    email: Joi.string()
    .email()
    .required()
    .messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    })
    .custom((value, helpers) => {
        if (NODE_ENV === 'production' && !isCorporateEmail(value)) {
            return helpers.message({ custom: 'Registration requires an official corporate/office email domain.' });
        }
        return value;
    }),
})

export const forgotPasswordEmailSchema = Joi.object({
    email: Joi.string()
    .email()
    .required()
    .messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    }),
})

export const forgotPasswordResetSchema = Joi.object({
    newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
        'string.base': 'New Password must be a string',
        'string.empty': 'New Password is required',
        'string.min': 'New Password should have a minimum length of {#limit}',
        'any.required': 'New Password is required',
    }),
})