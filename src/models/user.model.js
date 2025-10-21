const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            minlength: [3, "Name must be atleast 3 characters long"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            validate: {
                validator: (val) => {
                    return String(val).includes("@");
                },
                message: "Please enter a valid email.",
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            maxlength: [5, "Password must be atleast 5 characters long"],
        },
        logoUrl: {
            type: String,
            required: [true, "Channel logo is required"],
        },
        logoId: {
            type: String,
            required: [true, "Logo ID is required"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
        },
        channelName: {
            type: String,
            required: [true, "Channel name is required"],
            unique: true,
        },
        subscribers: {
            type: Number,
            default: 0,
        },
        subscribedChannels: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Channel",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
