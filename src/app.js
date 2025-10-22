const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const globalErrorHander = require("./middlewares/globalErrorHandlerMiddleware");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/v1/auth", authRoutes);

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHander);

module.exports = app;
