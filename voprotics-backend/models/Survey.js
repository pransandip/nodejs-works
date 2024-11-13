const mongoose = require("mongoose");

const Survey = new mongoose.Schema({
    businessId: {
        type: mongoose.Types.ObjectId,
    },
    surveyData: {
        type: Object
    }
}, { timestamps: true });

module.exports = mongoose.model("Survey", Survey);