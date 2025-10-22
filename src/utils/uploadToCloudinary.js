const fs = require("fs");

const cloudinary = require("../config/cloudinary.config");
const AppError = require("./AppError");

const uploadToCloudinary = async (file) => {
    try {
        const response = await cloudinary.uploader.upload(file.path, {
            folder: "youtube-api",
        });

        fs.unlinkSync(file.path);

        return {
            url: response.secure_url,
            id: response.public_id,
        };
    } catch (error) {
        try {
            fs.unlinkSync(file.path);
        } catch (deleteError) {
            console.error("Error deleting file:", deleteError.message);
        }

        // Log the error and rethrow it
        console.error("Could not upload file to Cloudinary:", error.message);
        throw new AppError("File upload to Cloudinary failed.", 500);
    }
};

module.exports = uploadToCloudinary;
