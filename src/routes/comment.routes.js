const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
    createComment,
    getCommentsOfSingleVideo,
    updateComment,
    deleteComment,
} = require("../controllers/comment.controllers");

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);
router.route("/").post(createComment).get(getCommentsOfSingleVideo);
router.route("/:commentId").patch(updateComment).delete(deleteComment);

module.exports = router;
