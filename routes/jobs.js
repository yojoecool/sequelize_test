require('dotenv').config();
const express = require('express');
const { JobsApplied, JobsSaved } = require('../models');
const jobFuncs = require('../modules/jobFuncs');
const { verifyUser } = require('../middleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jobs = await jobFuncs.filterJobs(JSON.parse(req.query.filters));
    res.json(jobs);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

router.get('/userJobs', verifyUser, async (req, res) => {
  try {
    const jobs = await jobFuncs.userJobs(req.locals.userId);
    res.json(jobs);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

router.post('/apply', verifyUser, async (req, res) => {
  console.log('applying for job', req.body);
  try {
    const appliedJob = await JobsApplied.create({
      jobSeekerId: req.locals.userId,
      jobId: req.body.jobId,
      status: 'Applied'
    });
    // console.log('appliedJob:', appliedJob);
    res.json({ success: true, appliedJob });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

router.post('/save', verifyUser, async (req, res) => {
  console.log('saving job', req.query.jobId);
  try {
    const savedJob = await JobsSaved.create({
      jobSeekerId: req.locals.userId,
      jobId: req.body.jobId
    });
    // console.log('savedJob:', savedJob);
    res.json({ success: true, savedJob });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

router.post('/unsave', verifyUser, async (req, res) => {
  try {
    await JobsSaved.destroy({
      where: {
        jobSeekerId: req.locals.userId,
        jobId: req.body.jobId
      }
    });
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

module.exports = router;
