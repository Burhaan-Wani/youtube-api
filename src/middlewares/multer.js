const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDirectoryPath = path.join(__dirname, "../../", "public");
if (!fs.existsSync(uploadDirectoryPath)) {
    fs.mkdirSync(uploadDirectoryPath);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectoryPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
