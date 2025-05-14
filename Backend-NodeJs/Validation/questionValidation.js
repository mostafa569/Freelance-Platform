const Joi = require("joi")

exports.questionValidation =  Joi.object({
        questionText: Joi.string().required().min(5),
        questionType: Joi.string().required().valid('multiple_choice', 'true_false', 'short_answer'),
        points: Joi.number().default(1).min(1),
    });