const express = require('express');
const router = express.Router();
const Run = require('../models/Run');
const mongoose = require('mongoose');


/**
 * Computes the experience level based on distance and total time.
 * @param {number} distance - The total distance of the run.
 * @param {number} totalTime - The total time taken for the run.
 * @returns {string} The experience level.
 */
function computeExperienceLevel(distance, totalTime) {
  const speed = distance / (totalTime / 60);
  if (speed > 7.5) return 'Expert';
  else if (speed > 6) return 'Advanced';
  else if (speed > 4.5) return 'Intermediate';
  else return 'Beginner';
}


/**
 * GET endpoint to fetch all runs.
 * @route GET /allRuns
 * @returns {Object[]} An array of run objects.
 */
router.get('/allRuns', async (req, res) => {
  try {
    const runs = await Run.find();
    res.json(runs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching runs');
  }
})


/**
 * POST endpoint for creating a new run.
 * @route POST /create
 * @param {Object} req.body - Run details from request body.
 * @returns {Object} The created run object.
 */
router.post('/create', async (req, res) => {
  const {
    stopsCoordinate, startLocationCoordinate, endLocationCoordinate,
    eventName, date, startTime, startLocation, endLocation, runType, runPace, length, totalTime
  } = req.body;


  const experienceLevel = computeExperienceLevel(length, totalTime);
  console.log(runPace)
  try {
    const newRun = new Run({
      stopsCoordinate,
      startLocationCoordinate,
      endLocationCoordinate,
      length,
      totalTime,
      date,
      startTime,
      startLocation,
      endLocation,
      runPace,
      runType: runType.toLowerCase(),
      experienceLevel
    });

    await newRun.save();
    res.status(201).json(newRun);
    console.log(newRun)
  } catch (error) {
    console.error('Server error creating the run:', error);
    res.status(500).send('Server error creating the run');
  }
});


/**
 * PUT endpoint to sign up a user for a run.
 * @route PUT /signup/:runId
 * @param {string} req.params.runId - The run ID from URL parameter.
 * @param {string} req.body.userId - The user ID from request body.
 * @returns {Object} The updated run object.
 */
router.put('/signup/:runId', async (req, res) => {
  try {
    const { runId } = req.params;
    const { userId } = req.body;

    const run = await Run.findById(runId);
    if (!run) {
      return res.status(404).send('Run not found');
    }

    if (!run.signUps.includes(userId)) {
      run.signUps.push(userId);
      await run.save();
      res.status(200).json(run);
    } else {
      res.status(400).send('User is already signed up for this run');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing up for the run');
  }
});



/**
 * GET endpoint to fetch runs signed up by a specific user.
 * @route GET /signed-up/:userId
 * @param {string} req.params.userId - The user ID from URL parameter.
 * @returns {Object[]} An array of run objects that the user has signed up for.
 */
router.get('/signed-up/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    const signedUpRuns = await Run.find({ 'signUps': objectIdUserId });

    if (signedUpRuns) {
      res.json(signedUpRuns);
    } else {
      res.status(404).json({ msg: `No runs found for user ${userId}` });
    }
  } catch (error) {
    console.error('Error fetching signed-up runs:', error);
    res.status(500).send('Error fetching signed-up runs');
  }
});


/**
 * POST endpoint to complete a run by a user.
 * @route POST /complete/:runId
 * @param {string} req.params.runId - The run ID from URL parameter.
 * @param {Object} req.body - Completion details from request body.
 * @returns {Object} The updated run object with completion details.
 */
router.post('/complete/:runId', async (req, res) => {
  console.log("Received data:", req.body);
  const { runId } = req.params;
  const { userId, time, distance, pace } = req.body;

  try {
    const run = await Run.findById(runId);
    if (!run) {
      return res.status(404).send('Run not found');
    }

    const completionDetails = { userId, time, distance, pace, date: new Date() };
    run.completedBy.push(completionDetails);
    console.log("run route ", completionDetails)
    await run.save();

    const updatedRun = await Run.findById(runId).populate('completedBy.userId');
    res.json(updatedRun);
  } catch (error) {
    console.error('Error marking run as completed:', error);
    res.status(500).send('Server error');
  }
});


/**
 * Constructs a MongoDB query for the run time based on the provided criteria.
 * @param {string} runTime - The expected total time range for the run.
 * @returns {Object} MongoDB query object for totalTime.
 */
const buildTimeQuery = (runTime) => {
  const timeCriteria = {
    '< 30 mins': { $lt: 30 },
    '30-45 mins': { $gte: 30, $lte: 45 },
    '46-60 mins': { $gte: 46, $lte: 60 },
    '1-1.5 hr': { $gte: 60, $lte: 90 },
    '1.5-2 hr': { $gte: 91, $lte: 120 },
    '2-3 hr': { $gte: 121, $lte: 180 },
    '3+ hr': { $gte: 181 }
  };
  return timeCriteria[runTime] || {};
};


/**
 * Constructs a MongoDB query for the date range.
 * @param {string} dateString - The selected date in string format.
 * @returns {Object} MongoDB query object for date.
 */
const buildDateQuery = (dateString) => {
  if (!dateString) return {};

  const selectedDate = new Date(dateString);
  const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);

  return { $gte: startDate, $lt: endDate };
};


/**
 * Route to fetch filtered runs based on various criteria.
 * @route POST /filtered
 * @param {Object} req.body - Object containing filter criteria.
 * @returns {Object[]} An array of run objects that match the filters.
 */
router.post('/filtered', async (req, res) => {
  try {
    const { experienceLevel, location, maxDistance, length, runTime, date } = req.body;
    let query = {};

    // Build query based on the experience level provided
    if (experienceLevel && experienceLevel !== '') {
      query.experienceLevel = experienceLevel;
    }

    // Build query based on the location and maxDistance provided
    if (location && maxDistance) {
      query.startLocationCoordinate = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [location.longitude, location.latitude]
          },
          $maxDistance: maxDistance
        }
      };
    }

    // Build query based on the length provided
    if (length && length !== '') {
      query.length = length;
    }

    // Build query based on the run time provided
    if (runTime && runTime !== '') {
      query.totalTime = buildTimeQuery(runTime);
    }

    // Build query based on the date provided
    if (date) {
      query.date = buildDateQuery(date);
    }

    const runs = await Run.find(query);
    res.json(runs);
  } catch (error) {
    console.error('Error fetching filtered runs:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
