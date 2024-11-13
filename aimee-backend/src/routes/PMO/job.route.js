const express = require('express');
const validate = require('../../middlewares/validate');
const jobsController = require('../../controllers/PMO/jobs.controller');
const upload = require('../../utils/fileUpload');
const {createJobSchema} = require('../../schemas/PMO/jobSchema');


const router = express.Router();

router.post('/create', createJobSchema, jobsController.createJob);

module.exports = router;