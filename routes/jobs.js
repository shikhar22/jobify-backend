const express = require('express');
const router = express.Router();

const { getJobs, newJob, updateJob, deleteJob, getJob, jobStats } = require('../controllers/jobsController');

router.route('/getJobs').get(getJobs);

router.route('/job/new').post(newJob);

router.route('/job/:id/:slug').get(getJob);

router.route('/stats/:topic').get(jobStats);

router.route('/job/:id').put(updateJob).delete(deleteJob);

module.exports = router;