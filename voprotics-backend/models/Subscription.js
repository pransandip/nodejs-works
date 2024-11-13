const mongoose = require('mongoose');

const Subscription = new mongoose.Schema({
    buyerId: {
        type: mongoose.Types.ObjectId,        
    },
    transactionAmount: {
        type: mongoose.Types.Decimal128,
        default: ""
    },
    transactionDate: {
        type: Date,
    },
    transactionStatus: {
        type: String,
        enum: ['Pending', 'Paid']
    },
    fName: {
        type: String,
        default: ""
    },
    lName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    jobTile: {
        type: String,
        default: ""
    },
    companyName: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    stripe_customer_id: {
        type: String,
        default: ""
    },
    subscription_id: {
        type: String,
        default: ""
    },
    invoice_id: {
        type: String,
        default: ""
    },
    paymentId: {
        type: mongoose.Types.ObjectId,
    }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', Subscription);