const mongoose = require('mongoose');

const Feedback = new mongoose.Schema({
    businessId: {
        type: mongoose.Types.ObjectId,
    },
    feedbackType: {
        type: String,
        enum: ['customer', 'employee', 'vendor']
    },
    feedbackEntry: {
        type: String,
        enum: ['manual', 'feedbackForm', 'csv']
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
    companyName: {
        type: String,
        default: ""
    },
    jobTitle: {
        type: String,
        default: ""
    },
    feedback: {
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
    source: {
        type: String,
        default: "unknown"
    },
    sentiment: {
        type: String,
        enum: ['Positive', 'Negative', 'Neutral']
    },
    category: {
        type: String,
        enum: [
            'Service',
            'App',
            'Product & Features',
            'Customer Care',
            'Company',
            'Security',
            'Other',
            'Bug / Glitch'
        ]
    },
    subcategory: {
        type: String,
        enum: [
            'Update / Version Used',
            'Reliable',
            'Layout / Design',
            'Ease of Use / Navigation',
            'Device Compatibility',
            'Speed of Use / Navigation',
            'Best / Worst',
            'Notifications / Alerts',
            'General',
            'Convenient / Useful',

            'Sub-theme 6',
            'Sub-theme 5',
            'Sub-theme 4',

            'Pending Transactions',
            'Managing Payees',
            'Direct Debit / Standing Order',
            'Available Balance Infomation',
            'General',
            'Transfers / Moving Money',
            'Account Information',
            'Versatility / Functions',
            'Debit / Credit Cards',
            'TouchID / FaceID',
            'Transactions / Statements Information',
            'Contactless / Apple Pay',

            'Responsiveness',
            'Contact Channel',
            'Attitude of Staff',
            'Problem Resolution, General',
          

            'Recommend',
            'Product / Service Comparison',
            'Overall Perception',

            'General Security',
            'Auto Log-out',
            'Verification / Identification',
            'Log In',

            'Suggestion / Request',
            'Miscellaneous',

            'Specific Feature Bug',
            'Crash / Freeze',
            'Re-installation Attempt',
            'Request for Fix',
            'Access / Login',
            'Error / Error Message',
            'Functionality',
            'Connection Error',
            'General'

        ]
    },
    action: {
        type: String,
        default: "recommended"
    },
    entryDate: {
        type: Date
    },
    urgency: {
        type: String,
        default: "None"
    },
    feedbackid: {
        type: Number
    },
    scoreRange: {
        type: Number,
        default: 5,
    },
    featured: {
        type: String,
        enum: ['featured', 'notfeatured']
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', Feedback);