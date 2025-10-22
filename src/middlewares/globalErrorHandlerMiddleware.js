const env = require("../config/env.config");
const AppError = require("../utils/AppError");

const devError = (error, res) => {
    return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error,
        stack: error.stack,
    });
};

const prodError = (error, res) => {
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
    return res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};

const HandleValidationErrors = (error) => {
    const errors = Object.values(error.errors).map((error) => error.message);
    const message = errors.join(". ");
    return new AppError(message, 400);
};

const HandleDuplicateFieldErrors = (error) => {
    const key = Object.keys(error.keyValue);
    const value = Object.values(error.keyValue);
    const message = `Field ${key} = '${value}' already taken. Please use a different one`;
    return new AppError(message, 400);
};

const handleCastError = () => {
    return new AppError(
        "Invalid ID format. Please provide a valid identifier",
        400
    );
};
const handleJWTExpiredError = () => {
    return new AppError("JWT token expired. Please login to continue", 401);
};

const handleJWTTokenError = () => {
    return new AppError("Invalid jwt signature or expired", 401);
};

const globalErrorHander = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    if (env.NODE_ENV === "development") {
        devError(error, res);
    } else if (env.NODE_ENV === "production") {
        let err = { ...error };
        err.message = error.message;
        if (error.name === "ValidationError")
            err = HandleValidationErrors(error);
        if (error.code === 11000) err = HandleDuplicateFieldErrors(error);
        if (error.name === "CastError") err = handleCastError(error);
        if (error.name === "TokenExpiredError") err = handleJWTExpiredError();
        if (error.name === "JsonWebTokenError") err = handleJWTTokenError();
        prodError(err, res);
    } else {
        console.log("NODE_ENV variable not set properly");
        res.status(error.status || 500).json({
            status: error.status || "error",
            message: error.message || "Internal server error",
        });
    }
};

module.exports = globalErrorHander;
