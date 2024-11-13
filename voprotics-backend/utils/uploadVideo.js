const multer  = require('multer');
const picPath = require("path");
const shortid = require("shortid");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, picPath.join(picPath.dirname(__dirname), "public/videos"));
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, shortid.generate() + '.' + 'webm')
    },
})

var uploadVideo = multer({ storage: storage });

module.exports = {
    uploadVideo
}