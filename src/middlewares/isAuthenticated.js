const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");
const env = require("../config/env.config");

const isAuthenticated = catchAsync(async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return next(
            new AppError("You are not logged in. Please login first", 401)
        );
    }

    const decoded = await promisify(jwt.verify)(token, env.JWT_SECRET);

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new AppError("The owner of this token doesn't exist", 404));
    }
    req.user = currentUser;
    next();
});

module.exports = isAuthenticated;
