const mongoose = require('mongoose');

const TestimonyVideo = new mongoose.Schema({
    businessId: {
        type: mongoose.Types.ObjectId,
    },
    testimonyId: {
        type: mongoose.Types.ObjectId,
    },
    videoPath: {
        type: String
    },
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("TestimonyVideo", TestimonyVideo);