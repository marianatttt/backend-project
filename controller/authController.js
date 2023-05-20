const bcrypt = require('bcryptjs');

const User = require('../model/User')
const Role = require('../model/Role')
const authService = require("../service/authService");


class authController {
    async registration(req, res) {
        try {
            const { username, password, role, email } = req.body;
            const candidate = await User.findOne({ email });
            if (candidate) {
                return res.status(400).json({ message: "A user with such an email already exists" });
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            let roleExists;

            if (role) {
                const roleValue = role.toUpperCase();
                roleExists = await Role.findOne({ value: roleValue });

                if (!roleExists) {
                    return res.status(400).json({ message: "Invalid user role" });
                }
            } else {
                roleExists = await Role.findOne({ value: "USER" });
            }

            const user = new User({
                username,
                email,
                password: hashPassword,
                roles: [roleExists.value],
            });

            await user.save();
            return res.json({ message: "User successfully registered" });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Registration failed" });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: `User ${email} не not found` });
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Incorrect password or email entered' });
            }
            const accessToken = authService.generateAccessToken(user._id, user.roles);
            const refreshToken = authService.generateRefreshToken(user._id);
            return res.json({ accessToken, refreshToken });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Помилка логінації' });
        }
    }

    async refreshToken(req, res) {
        try {
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: "Refresh token not provided" });
            }

            const decodedData = authService.verifyRefreshToken(refreshToken);
            const user = await User.findById(decodedData.userId);

            if (!user) {
                return res.status(401).json({ message: "Invalid refresh token" });
            }

            const accessToken = authService.generateAccessToken(user._id, user.roles);
            return res.json({ accessToken });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Refresh token error' });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new authController()
