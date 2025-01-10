const Job = require('../models/jobs')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

//Get All jobs => /api/v1/jobs
exports.getJobs = catchAsyncErrors(async (req, res, next) => {

    const jobs = await Job.find();
    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    })
});

// Get a single job with id and slug   =>  /api/v1/job/:id/:slug
exports.getJob = catchAsyncErrors(async (req, res, next) => {

    const job = await Job.find({ $and: [{ _id: req.params.id }, { slug: req.params.slug }] })
    // .populate({
    //     path: 'user',
    //     select: 'name'
    // });

    if (!job || job.length === 0) {
        // return next(new ErrorHandler('Job not found', 404));
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        });
    }

    res.status(200).json({
        success: true,
        data: job
    });
});

exports.newJob = catchAsyncErrors(async (req, res, next) => {
    const job = await Job.create(req.body);

    res.status(200).json({
        success: true,
        message: 'Job Created',
        data: job
    })
});

// Update a Job  =>  /api/v1/job/:id
exports.updateJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return next(new ErrorHandler('Job not found', 404));
    }

    // Check if the user is owner
    // if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //     return next(new ErrorHandler(`User(${req.user.id}) is not allowed to update this job.`))
    // }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: 'Job is updated.',
        data: job
    });
});

// Delete a Job   =>  /api/v1/job/:id
exports.deleteJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id).select('+applicantsApplied');

    if (!job) {
        return next(new ErrorHandler('Job not found', 404));
    }

    // Check if the user is owner
    // if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //     return next(new ErrorHandler(`User(${req.user.id}) is not allowed to delete this job.`))
    // }

    // Deleting files associated with job

    // for (let i = 0; i < job.applicantsApplied.length; i++) {
    //     let filepath = `${__dirname}/public/uploads/${job.applicantsApplied[i].resume}`.replace('\\controllers', '');

    //     fs.unlink(filepath, err => {
    //         if (err) return console.log(err);
    //     });
    // }

    job = await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Job is deleted.'
    });

});

// Get stats about a topic(job)  =>  /api/v1/stats/:topic
exports.jobStats = catchAsyncErrors(async (req, res, next) => {
    const stats = await Job.aggregate([
        {
            $match: { $text: { $search: "\"" + req.params.topic + "\"" } }
        },
        {
            $group: {
                _id: { $toUpper: '$experience' },
                totalJobs: { $sum: 1 },
                avgPosition: { $avg: '$positions' },
                avgSalary: { $avg: '$salary' },
                minSalary: { $min: '$salary' },
                maxSalary: { $max: '$salary' }
            }
        }
    ]);

    if (stats.length === 0) {
        return next(new ErrorHandler(`No stats found for - ${req.params.topic}`, 200));
    }

    res.status(200).json({
        success: true,
        data: stats
    });
});