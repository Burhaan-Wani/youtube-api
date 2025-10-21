const mongoose = require("mongoose");
const env = require("./env.config");

const connectDB = async () => {
  try {
    await mongoose.connect(env.DB_URI);
    console.log("Connected to Database.");
  } catch (error) {
    console.log("Failed to connect to Database.");
  }
};

module.exports = connectDB;
