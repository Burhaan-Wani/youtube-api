const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
                message: "Please enter a valid email",
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [5, "Password must be atleast 5 characters long"],
            select: false,
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
        subscribers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        subscribedChannels: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual("subscribersCount").get(function () {
    return this.subscribers.length;
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePasswords = async function (password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
