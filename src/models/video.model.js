const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Video title is required"],
            minlength: [5, "Title must be atleast 5 characters long"],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Video description is required"],
            minlength: [1, "Title must be atleast 5 characters long"],
            trim: true,
        },
        videoUrl: {
            type: String,
            required: [true, "Video is required"],
            trim: true,
        },
        thumbnailUrl: {
            type: String,
            required: [true, "Video thumbnail is required"],
            trim: true,
        },
        videoId: {
            type: String,
            required: [true, "Video ID is required"],
            trim: true,
        },
        thumbnailId: {
            type: String,
            required: [true, "Thumbnail ID is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        disLikedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        viewedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        tags: {
            type: [String],
            required: [true, "Tags are required"],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

videoSchema.virtual("likes").get(function () {
    return this.likedBy.length;
});

videoSchema.virtual("disLikes").get(function () {
    return this.disLikedBy.length;
});

videoSchema.virtual("views").get(function () {
    return this.viewedBy.length;
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
