const { getEnv } = require("../utils/getEnv");

const envVariables = () => {
    return {
        PORT: getEnv("PORT", "3001"),
        NODE_ENV: getEnv("NODE_ENV", "production"),
        DB_URI: getEnv("DB_URI"),
        DB_PASSWORD: getEnv("DB_PASSWORD"),
        CLOUDINARY_NAME: getEnv("CLOUDINARY_NAME"),
        CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
        CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),
    };
};

const env = envVariables();

module.exports = env;
