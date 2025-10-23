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

// Increase views of video
const getVideoById = catchAsync(async (req, res, next) => {
    const video = await Video.findByIdAndUpdate(
        req.params.id,
        {
            $addToSet: { viewedBy: req.user._id },
        },
        {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        data: {
            video,
        },
    });
});

const getMyVideos = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const myVideos = await Video.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
        status: "success",
        data: {
            videos: myVideos,
        },
    });
});

const likeVideo = catchAsync(async (req, res, next) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId);

    const likeIndex = video.likedBy.indexOf(userId);
    const disLikeIndex = video.disLikedBy.indexOf(userId);

    if (likeIndex !== -1) {
        video.likedBy.splice(likeIndex, 1);
    } else {
        video.likedBy.push(userId);
        if (disLikeIndex !== -1) {
            video.disLikedBy.splice(disLikeIndex, 1);
        }
    }
    await video.save();

    res.status(200).json({});
});

const disLikeVideo = catchAsync(async (req, res, next) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId);

    const likeIndex = video.likedBy.indexOf(userId);
    const disLikeIndex = video.disLikedBy.indexOf(userId);

    // If already disLiked, remove disLike
    if (disLikeIndex !== -1) {
        video.disLikedBy.splice(likeIndex, 1);
    } else {
        video.disLikedBy.push(userId);
        if (likeIndex !== -1) {
            video.likedBy.splice(disLikeIndex, 1);
        }
    }
    await video.save();

    res.status(200).json({});
});

const getVideosByCategory = catchAsync(async (req, res, next) => {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const videos = await Video.find({ category })
        .skip(skip)
        .limit(limit)
        .exec();

    const total = await Video.countDocuments({ category });

    res.status(200).json({
        success: true,
        data: {
            videos,
        },
        pagination: {
            page,
            limit,
            total,
        },
    });
});
const getVideosByTags = catchAsync(async (req, res, next) => {
    const { tags } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    // Split tags by comma if multiple tags are provided
    const tagArray = tags.split(",").map((tag) => tag.trim());

    const videos = await Video.find({ tags: { $in: tagArray } })
        .skip(skip)
        .limit(limit)
        .exec();

    const total = await Video.countDocuments({ tags: { $in: tagArray } });

    res.status(200).json({
        success: true,
        data: { videos },
        pagination: {
            page,
            limit,
            total,
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
    likeVideo,
    disLikeVideo,
    getVideosByCategory,
    getVideosByTags,
};
