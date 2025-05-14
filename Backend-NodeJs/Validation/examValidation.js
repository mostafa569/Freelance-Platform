const Joi = require("joi");

exports.examValidation = Joi.object({
    title: Joi.string()
        .min(3)
        .required()
        .messages({
            "string.min": "Title must be at least 3 characters.",
            "any.required": "Title is required.",
        }),

    description: Joi.string()
        .min(3)
        .allow("")
        .messages({
            "string.min": "Description must be at least 3 characters if provided.",
        }),
});
