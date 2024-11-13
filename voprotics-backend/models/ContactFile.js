const mongoose = require('mongoose');

const ContactFile = new mongoose.Schema({
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
    contactType: {
        type: String,
        enum: ['customer', 'employee', 'vendor']
    },
    contactEntry: {
        type: String,
        enum: ['manual', 'csv']
    }
}, { timestamps: true });

module.exports = mongoose.model('ContactFile', ContactFile);