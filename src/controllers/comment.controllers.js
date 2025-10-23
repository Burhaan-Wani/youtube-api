const Comment = require("../models/comment.model");
const Video = require("../models/video.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const createComment = catchAsync(async (req, res, next) => {
    const { videoId } = req.params;
    const { commentText } = req.body;
    if (!commentText) {
        return next(new AppError("Comment text is required", 400));
    }

    const existsVideo = await Video.findById(videoId);
    if (!existsVideo) {
        return next(new AppError("Video not found", 404));
    }

    const existsComment = await Comment.find({ videoId, userId: req.user._id });
    if (existsComment) {
        return next(new AppError("You already commented on this video", 400));
    }
    const comment = await Comment.create({
        userId: req.user._id,
        videoId,
        commentText,
    });

    res.status(201).json({
        status: "success",
        data: {
            comment,
        },
    });
});

const getCommentsOfSingleVideo = catchAsync(async (req, res, next) => {
    const { videoId } = req.params;

    const comments = await Comment.find({ videoId }).populate("userId");
    res.status(200).json({
        status: "success",
        data: {
            comments,
        },
    });
});

const updateComment = catchAsync(async (req, res, next) => {
    const { commentId } = req.params;
    const { commentText } = req.body;

    const existsComment = await Comment.findById(commentId);

    if (!existsComment) {
        return next(new AppError("Comment not found", 404));
    }

    if (existsComment.userId.toString() !== req.user._id.toString()) {
        return next(
            new AppError("You are not authorized to update this comment", 403)
        );
    }

    existsComment.commentText = commentText;
    await existsComment.save();

    res.status(200).json({
        status: "success",
        data: {
            comment: existsComment,
        },
    });
});

const deleteComment = catchAsync(async (req, res, next) => {
    const { commentId } = req.params;

    const existsComment = await Comment.findById(commentId);

    if (!existsComment) {
        return next(new AppError("Comment not found", 404));
    }

    if (existsComment.userId.toString() !== req.user._id.toString()) {
        return next(
            new AppError("You are not authorized to delete this comment", 403)
        );
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
        status: "success",
        message: "Comment deleted successfully",
    });
});

module.exports = {
    createComment,
    getCommentsOfSingleVideo,
    updateComment,
    deleteComment,
};
