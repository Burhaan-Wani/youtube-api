const Video = require("../models/video.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
    uploadToCloudinary,
    deleteFromCloudninary,
} = require("../utils/uploadToCloudinary");

const uploadVideo = catchAsync(async (req, res, next) => {
    const { title, description, tags, category } = req.body;
    if (
        Object.keys(req.files).length < 2 ||
        req.files?.video[0] === undefined ||
        req.files?.thumbnail[0] === undefined
    ) {
        return next(new AppError("Video and Thumbnail is required", 400));
    }

    const [video, thumbnail] = await Promise.all([
        uploadToCloudinary(req.files.video[0]),
        uploadToCloudinary(req.files.thumbnail[0]),
    ]);

    const newVideo = await Video.create({
        userId: req.user._id,
        title,
        description,
        videoUrl: video.url,
        videoId: video.id,
        thumbnailUrl: thumbnail.url,
        thumbnailId: thumbnail.id,
        category,
        tags: tags.split(",") || [],
    });
    res.status(200).json({
        status: "success",
        data: {
            video: newVideo,
        },
    });
});

const updateVideo = catchAsync(async (req, res, next) => {
    const { title, description, category, tags } = req.body;

    const video = await Video.findById(req.params.id);
    if (!video) {
        return next(new AppError("Video not found", 404));
    }

    if (req.user._id.toString() !== video.userId.toString()) {
        return next(new AppError("You are not the owner of this video", 403));
    }
    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    video.tags = tags?.split(",") || video.tags;

    if (req.file) {
        // Thumbnail file

        const [thumbnail] = await Promise.all([
            uploadToCloudinary(req.file),
            deleteFromCloudninary(video.thumbnailId),
        ]);
        video.thumbnailUrl = thumbnail.url;
        video.thumbnailId = thumbnail.id;
    }
    await video.save({ validateBeforeSave: false });
    res.status(200).json({
        status: "success",
        data: {
            video,
        },
    });
});

const getAllVideos = catchAsync(async (req, res, next) => {
    const videos = await Video.find();
    res.status(200).json({
        status: "success",
        data: {
            videos,
        },
    });
});

const deleteVideo = catchAsync(async (req, res, next) => {
    const videoId = req.params.id;

    const video = await Video.findById(videoId);
    if (!video) {
        return next(new AppError("Video not found", 404));
    }

    if (req.user._id.toString() !== video.userId.toString()) {
        return next(new AppError("You are not the owner of this video", 403));
    }
    await Promise.all([
        deleteFromCloudninary(video.videoId),
        deleteFromCloudninary(video.thumbnailId),
    ]);
    await Video.findByIdAndDelete(videoId);

    res.status(200).json({
        status: "success",
        message: "Video deleted successfully",
    });
});

const getVideoById = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.id);
    res.status(200).json({
        status: "success",
        data: {
            video,
        },
    });
});

const getMyVideos = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const myVideos = await Video.find({ userId });

    res.status(200).json({
        status: "success",
        data: {
            videos: myVideos,
        },
    });
});
module.exports = {
    uploadVideo,
    updateVideo,
    getAllVideos,
    deleteVideo,
    getVideoById,
    getMyVideos,
};
