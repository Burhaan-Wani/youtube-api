const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const videoRoutes = require("./routes/video.routes");
const userRoutes = require("./routes/user.routes");
const commentRoutes = require("./routes/comment.routes");
const globalErrorHander = require("./middlewares/globalErrorHandlerMiddleware");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/comments", commentRoutes);

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHander);

module.exports = app;
