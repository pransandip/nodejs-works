const mongoose = require('mongoose');

const Payment = new mongoose.Schema({
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
  checkout_id: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', Payment);