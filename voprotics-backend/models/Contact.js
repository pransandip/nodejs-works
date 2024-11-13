const mongoose = require('mongoose');

const Contact = new mongoose.Schema({
    businessId: {
        type: mongoose.Types.ObjectId
    },
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    companyName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    zip: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    fileId: {
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

module.exports = mongoose.model('Contact', Contact);