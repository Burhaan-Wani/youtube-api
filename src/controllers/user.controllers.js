const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
    deleteFromCloudninary,
    uploadToCloudinary,
} = require("../utils/uploadToCloudinary");

const updateProfile = catchAsync(async (req, res, next) => {
    const { channelName, phoneNumber } = req.body;
    const user = await User.findById(req.user._id);
    if (req.file) {
        const [_, newLogo] = await Promise.all([
            deleteFromCloudninary(req.user.logoId),
            uploadToCloudinary(req.file),
        ]);
        user.logoUrl = newLogo.url;
        user.logoId = newLogo.id;
    }
    user.channelName = channelName || user.channelName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

const subscribeToChannel = catchAsync(async (req, res, next) => {
    const { userId: channelId } = req.params;

    // Prevent user from subscribing to themselves
    if (req.user._id.toString() === channelId) {
        return next(new AppError("Cannot subscribe to your own channel", 400));
    }

    // Find the current user and the channel they're trying to subscribe to
    const currentUser = await User.findById(req.user._id);
    const channelUser = await User.findById(channelId);

    if (!channelUser) {
        return next(new AppError("Channel not found", 404));
    }

    // Check if the user is already subscribed
    const isSubscribed = currentUser.subscribedChannels.includes(channelId);

    // Toggle subscription
    if (isSubscribed) {
        // Unsubscribe
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { subscribedChannels: channelId } },
            { new: true }
        );

        await User.findByIdAndUpdate(
            channelId,
            { $pull: { subscribers: req.user._id } },
            { new: true }
        );
    } else {
        // Subscribe
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { subscribedChannels: channelId } },
            { new: true }
        );

        await User.findByIdAndUpdate(
            channelId,
            { $push: { subscribers: req.user._id } },
            { new: true }
        );
    }

    res.status(200).json({
        status: "success",
        message: isSubscribed
            ? "Unsubscribed successfully"
            : "Subscribed successfully",
    });
});

module.exports = {
    updateProfile,
    subscribeToChannel,
};
