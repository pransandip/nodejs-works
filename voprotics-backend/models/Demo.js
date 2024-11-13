const mongoose = require('mongoose');

const Demo = new mongoose.Schema(
  {
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
    industry: {
      type: String,
      default: ""
    },
    country: {
      type: String,
      default: ""
    },
    areaOfInterest: {
      type: String,
      default: ""
    },
    comments: {
      type: String,
      default: ""
    },
    stripe_customer_id: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Demo', Demo);