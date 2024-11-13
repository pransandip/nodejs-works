const mongoose = require("mongoose");

const TestimonialText = new mongoose.Schema({
    businessId: {
        type: mongoose.Types.ObjectId,
    },
    testimonyId: {
        type: mongoose.Types.ObjectId,
    },
    imagePath: {
        type: String
    },
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    testimonial: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("TestimonialText", TestimonialText);