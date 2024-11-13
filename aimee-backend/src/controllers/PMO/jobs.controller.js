const jobService = require('../../services/PMO/job.service');

// job controller functions

function createJob(req, res, next) {
    jobService
      .create(req, res)
      .then(() => res.json({ message: "Job created" }))
      .catch((error) => res.json({ message: error }));
  }

module.exports  = {
    createJob,
};