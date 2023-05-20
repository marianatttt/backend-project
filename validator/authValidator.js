const Joi = require("joi");

const regexp = require("../config/regexp");

module.exports = {
    newUserValidator: Joi.object({
        username: Joi.string().min(2).max(100),
        email: Joi.string().regex(regexp.EMAIL).lowercase().trim().required(),
        password: Joi.string().regex(regexp.PASSWORD).required(),
        role: Joi.string()

    }),

    loginValidator: Joi.object({
        email: Joi.string().regex(regexp.EMAIL).lowercase().trim().required(),
        password: Joi.string().regex(regexp.PASSWORD).required(),

    })
}