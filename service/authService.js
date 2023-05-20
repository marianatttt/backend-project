const jwt = require("jsonwebtoken");

const { SECRET_ACCESS, SECRET_REFRESH} = require("../config/config")
const User = require("../model/User");
const ApiError = require('../error/apiError')

module.exports = {
    registerUser: async (user) => {
        try {
            const newUser = new User(user);
            await newUser.save();
            return "user successfully registered";
        } catch (error) {
            throw new ApiError(error.message);
        }
    },
    verifyRefreshToken: (refreshToken) => {

        try {
            const decoded = jwt.verify(refreshToken, SECRET_REFRESH);
            return decoded;
        } catch (error) {
            throw new Error("Invalid refresh token");
        }
    },

    generateAccessToken: (userId, roles) => {
        const payload = {
            userId,
            roles,
        };

        const options = { expiresIn: "24h" };
        return jwt.sign(payload, SECRET_ACCESS, options);
    },

    generateRefreshToken: (userId) => {
        const payload = {
            userId,
        };

        const options = { expiresIn: "7d" };
        return jwt.sign(payload, SECRET_REFRESH, options);
    }
}



