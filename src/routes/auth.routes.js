const express = require("express");
const {
    signup,
    login,
    logout,
    me,
} = require("../controllers/auth.controllers");
const upload = require("../middlewares/multer");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/signup", upload.single("logo"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isAuthenticated, me);

module.exports = router;
