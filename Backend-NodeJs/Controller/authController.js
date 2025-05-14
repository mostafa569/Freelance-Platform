const mongoose = require('mongoose');
const ThrowMessage = require('../utils/ThrowMessage');
const { catchHandler } = require('../utils/CatchHandler');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../Model/User');
const bcryptjs = require('bcryptjs');

exports.register = catchHandler(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ThrowMessage(400, "Email already exists");
    }

    // Create and save new user
    const user = new User({
        username,
        email,
        password: password,
        role,
    });
    await user.save();

    res.status(201).json({
        message: "Registration successful",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    });
});
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email And Password Required",
            status: "fail"
        });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
            message: "Email Or Password Not Valid",
            status: "fail"
        });
    }
    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({
            message: "Email Or Password Not Valid",
            status: "fail"
        });
    }
    const token = jsonwebtoken.sign({ userId: user._id, email: user.email, role: user.role }, process.env.SECRET_KEY);
    return res.status(200).json({
        message: "Success Log In",
        status: "success",
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
};