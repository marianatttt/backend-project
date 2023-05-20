const jwt = require('jsonwebtoken')

const {SECRET_ACCESS} = require('../config/config')
const authValidator = require('../validator/authValidator');
const {ApiError} = require("../error/ApiError");


module.exports = {
    isNewUserValid: async (req, res, next) => {
        try {
            let validate = authValidator.newUserValidator.validate(req.body);
            if (validate.error) {
                throw new ApiError(validate.error.message, 400);
            }
            req.body = validate.value;

            next()
        } catch (e) {
            next(e);
        }
    },

    isLoginValid: async (req, res, next) => {
        try {
            const validate = authValidator.loginValidator.validate(req.body);
            if (validate.error) {
                throw new ApiError(validate.error.message);
            }
            next();
        } catch (e) {
            next(e);
        }
    },

    isAuthorization: async (req, res, next) => {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                throw new ApiError('User is not authorized', 403);

            }
            const decodedData = jwt.verify(token, SECRET_ACCESS )
            req.user = decodedData
            next()

        } catch (e) {
            console.log(e)
            throw new ApiError('User is not authorized', 403);
        }
    }
}
