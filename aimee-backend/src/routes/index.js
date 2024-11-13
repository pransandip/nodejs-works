
const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const customerRoute = require('./CRM/customer.route')
const enquiriesRoute = require('./CRM/enquiries.route');
const quoteRoute = require('./CRM/quote.route');
//const projectRoute = require('./PMO/project.route');

const router = express.Router();

router.use('/auth',authRoute);
router.use('/user',userRoute);
router.use('/crm/customer',customerRoute);
router.use('/crm/enquiries',enquiriesRoute);
router.use('/crm/quote',quoteRoute);
//router.use('/pmo/project',projectRoute);
  module.exports = router;