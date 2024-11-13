const multer  = require('multer');
const shortid = require("shortid");
const picPath = require("path");

const storageMulti = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, DIR);
        cb(null, picPath.join(picPath.dirname(__dirname), "public/feedbacks"));
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, shortid.generate() + '-' + fileName)
    }
});

var uploadMulti = multer({
    storage: storageMulti,
});

module.exports = {
    uploadMulti
}