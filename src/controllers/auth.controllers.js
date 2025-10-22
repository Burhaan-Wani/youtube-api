const env = require("../config/env.config");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");
const jwt = require("jsonwebtoken");

const signup = catchAsync(async (req, res, next) => {
    const file = await uploadToCloudinary(req.file);
    const newUser = await User.create({
        ...req.body,
        logoUrl: file.url,
        logoId: file.id,
    });
    newUser.password = undefined;
    res.status(200).json({
        status: "success",
        data: {
            user: newUser,
        },
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("email and password is required", 400));
    }

    const existsUser = await User.findOne({ email }).select("+password");
    if (!existsUser) {
        return next(new AppError("User with this email does not exist", 404));
    }

    if (
        !existsUser ||
        !(await existsUser.comparePasswords(password, existsUser.password))
    ) {
        return next(new AppError("email or password is incorrect", 401));
    }

    const token = jwt.sign({ userId: existsUser._id }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    });

    existsUser.password = undefined;
    res.status(200).json({
        status: "success",
        data: {
            user: existsUser,
        },
    });
});

const logout = catchAsync((req, res, next) => {
    res.cookie("jwt", "", {
        maxAge: 0,
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({
        status: "success",
        message: "Logout successful",
    });
});

const me = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});
module.exports = {
    signup,
    login,
    logout,
    me,
};
