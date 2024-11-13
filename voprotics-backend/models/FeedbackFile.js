const mongoose = require('mongoose');

const FeedbackFile = new mongoose.Schema({
    businessId: {
        type: mongoose.Types.ObjectId
    },
    fileName: {
        type: String,
        default: ""
    },
    filePath: {
        type: Array,
        default: []
    },
    feedbackType: {
        type: String,
        enum: ['customer', 'employee', 'vendor']
    },
    feedbackEntry: {
        type: String,
        enum: ['manual', 'csv']
    },
}, { timestamps: true });

module.exports = mongoose.model('FeedbackFile', FeedbackFile);