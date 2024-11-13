const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // For error handling (optional)

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "../assets/uploads");
    fs.exists(uploadsDir, (exists) => {
      if (!exists) {
        fs.mkdir(uploadsDir, { recursive: true }, (err) => {
          if (err) {
            return cb(err); // Handle error creating directory (optional)
          }
        });
      }
      cb(null, uploadsDir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
module.exports = upload;