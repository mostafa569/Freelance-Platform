const Joi = require("joi");

exports.registerValidation = Joi.object({
    username: Joi.string()
        .pattern(/^[A-Za-z]{3,}$/)
        .min(3)
        .required()
        .messages({
            "string.pattern.base": "Username must contain only letters and be at least 3 characters.",
        }),

    email: Joi.string()
        .pattern(/^[a-zA-Z0-9*#&_-]+@gmail\.com$/)
        .required()
        .messages({
            "string.pattern.base": "Email must be a valid Gmail address.",
        }),

    password: Joi.string()
        .pattern(/^[a-zA-Z]{5,}$/)
        .min(5)
        .required()
        .messages({
            "string.pattern.base": "Password must start with at least 3 letters and contain at least one special character or number.",
        }),

    role: Joi.string()
        .valid("student", "teacher")
        .default("student")
});
// authValidation.js

exports.loginValidation = Joi.object({
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9*#&_-]+@gmail\.com$/)
        .required()
        .messages({
            "string.pattern.base": "Email must be a valid Gmail address.",
        }),

    password: Joi.string()
        .min(5)
        .required()
        .messages({
            "string.min": "Password must be at least 5 characters.",
        }),
});
