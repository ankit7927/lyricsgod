const multer = require("multer");

const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: localStorage });
module.exports = upload;