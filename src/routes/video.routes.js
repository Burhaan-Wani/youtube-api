const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const commentRouter = require("./comment.routes");
const {
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
} = require("../controllers/video.controllers");
const upload = require("../middlewares/multer");

const router = express.Router();

router.use("/:videoId/comments", commentRouter);

router.use(isAuthenticated);
router.route("/my-videos").get(getMyVideos);
router
    .route("/")
    .post(
        upload.fields([
            { name: "video", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
        uploadVideo
    )
    .get(getAllVideos);
router.get("/category/:category", getVideosByCategory);
router.get("/tags/:tags", getVideosByTags);
router.post("/:videoId/like", likeVideo);
router.post("/:videoId/disLike", disLikeVideo);

router
    .route("/:id")
    .patch(upload.single("thumbnail"), updateVideo)
    .delete(deleteVideo)
    .get(getVideoById);

module.exports = router;
