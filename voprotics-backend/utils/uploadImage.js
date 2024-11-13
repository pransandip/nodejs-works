const multer  = require('multer');
const picPath = require("path");
const shortid = require("shortid");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, picPath.join(picPath.dirname(__dirname), "public/images"));
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, shortid.generate() + '-' + fileName)
    },
})

var uploadImage = multer({ storage: storage });

module.exports = {
    uploadImage
}