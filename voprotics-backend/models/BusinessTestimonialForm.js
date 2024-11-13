const mongoose = require('mongoose');

const BusinessTestimonialForm = new mongoose.Schema({
    businessId: {
        type: mongoose.Types.ObjectId,
    },
    logo: {
        type: String
    },
    title: {
        type: String,
    },
    description: {
        type: String
    },
    questionOne: {
        type: Object
    },
    questionTwo: {
        type: Object
    },
    questionThree: {
        type: Object
    }
}, { timestamps: true });


module.exports = mongoose.model("BusinessTestimonialForm", BusinessTestimonialForm);