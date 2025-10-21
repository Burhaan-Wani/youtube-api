const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/v1/auth", authRoutes);

module.exports = app;
