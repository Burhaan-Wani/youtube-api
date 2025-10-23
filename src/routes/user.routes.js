const express = require("express");
const {
    updateProfile,
    subscribeToChannel,
} = require("../controllers/user.controllers");
const upload = require("../middlewares/multer");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.use(isAuthenticated);
router.route("/update-profile").patch(upload.single("logo"), updateProfile);
router.route("/:userId").post(subscribeToChannel);

module.exports = router;
