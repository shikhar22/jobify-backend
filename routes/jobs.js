const express = require('express');
const router = express.Router();

const { getJobs, newJob, updateJob, deleteJob, getJob, jobStats } = require('../controllers/jobsController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/getJobs').get(getJobs);

router.route('/job/new').post(isAuthenticatedUser, authorizeRoles('employeer', 'admin'), newJob);

router.route('/job/:id/:slug').get(getJob);

router.route('/stats/:topic').get(jobStats);

router.route('/job/:id')
    .put(isAuthenticatedUser, authorizeRoles('employeer', 'admin'), updateJob)
    .delete(isAuthenticatedUser, authorizeRoles('employeer', 'admin'), deleteJob);

module.exports = router;