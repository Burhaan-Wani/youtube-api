const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const videoRoutes = require("./routes/video.routes");
const userRoutes = require("./routes/user.routes");
const globalErrorHander = require("./middlewares/globalErrorHandlerMiddleware");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/users", userRoutes);

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHander);

module.exports = app;
