const express = require('express');
const router = express.Router();
const Run = require('../models/Run');
const mongoose = require('mongoose');


// Helper function to compute experience level based on run data
function computeExperienceLevel(distance, totalTime) {
    const speed = distance / (totalTime / 60); // Speed in km/h
    if (speed > 7.5) return 'Expert';
    else if (speed > 6) return 'Advanced';
    else if (speed > 4.5) return 'Intermediate';
    else return 'Beginner';
  }

// GET endpoint to fetch all runs
router.get('/allRuns', async (req, res) => {
  try {
    const runs = await Run.find();
    res.json(runs); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching runs');
  }
})

// POST endpoint for creating a new run with automatic experience level calculation
router.post('/create', async (req, res) => {
  const {
    stopsCoordinate, startLocationCoordinate, endLocationCoordinate,
    eventName, date, startTime, startLocation, endLocation, runType, runPace, length, totalTime
  } = req.body;

  const experienceLevel = computeExperienceLevel(length, totalTime);

  try {
    const newRun = new Run({
      stopsCoordinate, startLocationCoordinate, endLocationCoordinate,
      eventName, date, startTime, startLocation, endLocation,
      runType, runPace, length, totalTime, experienceLevel
    });
    await newRun.save();
    res.status(201).json(newRun);
  } catch (error) {
    console.error('Server error creating the run:', error);
    res.status(500).send('Server error creating the run');
  }
});



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
    }
    res.status(200).json(run);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing up for the run');
  }
});

// Fetch runs signed up by a specific user
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

router.post('/filtered', async (req, res) => {
  console.log("Request body:", req.body);
  try {
      const { experienceLevel } = req.body;
      let query = {};

      if (experienceLevel) {
          query.experienceLevel = experienceLevel;
      }

      const runs = await Run.find(query);
      res.json(runs);
  } catch (error) {
      console.error('Error fetching filtered runs:', error);
      res.status(500).send('Server error');
  }
});


module.exports = router;
