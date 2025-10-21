require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db.config");
const env = require("./config/env.config");

const PORT = env.PORT;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("Failed to connect to DB");
  });
