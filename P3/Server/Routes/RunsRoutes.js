const express = require('express');
const router = express.Router();
const { parseGPX } = require('../GxpParser.js');
const Run = require('../models/Run');
const { geocodeLocation } = require('../GeoCoding.js');
const mongoose = require('mongoose');



router.get('/', async (req, res) => {
  try {
    const runs = await Run.find(); // Fetch all runs
    res.json(runs); // Send the runs back in the response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching runs');
  }
});

router.post('/api/geocode', async (req, res) => {
  const { locationString } = req.body;
  try {
    const coordinates = await geocodeLocation(locationString);
    res.json({ coordinates });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during geocoding');
  }
});


// POST endpoint for creating a new run
router.post('/create', async (req, res) => {
  try {
    const { stops, length, totalTime, date, startTime, startLocation, endLocation, runType, runPace } = req.body;
    const newRun = new Run({
      stops,
      length,
      totalTime,
      date,
      startTime,
      startLocation,
      endLocation,
      runType,
      runPace,
    });

    await newRun.save();
    res.status(201).json(newRun);
  } catch (error) {
    console.error(error);
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

    // Check if userId is not already in the signUps array
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
    // Convert string to ObjectId for MongoDB
    const objectIdUserId = mongoose.Types.ObjectId(userId);
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
  const { runId } = req.params;
  const { userId, time, distance, pace } = req.body;

  try {
    const run = await Run.findById(runId);
    if (!run) {
      return res.status(404).send('Run not found');
    }

    const completionDetails = { userId, time, distance, pace, date: new Date() };
    run.completedBy.push(completionDetails);

    await run.save();

    // Modify the response to send back the updated run with the completion details
    const updatedRun = await Run.findById(runId).populate('completedBy.userId');
    res.json(updatedRun);
  } catch (error) {
    console.error('Error marking run as completed:', error);
    res.status(500).send('Server error');
  }
});



router.get('/importGPX', async (req, res) => {
  try {
    const gpxData = await parseGPX('./Blacks-Mountain-Half-Marathon-2019.gpx');
    const runEvent = {
      eventName: "Blacks Mountain Half-Marathon 2019",
      // Assuming gpxData contains an array of waypoints or similar data you can use
      startLocation: { lat: gpxData.tracks[0].segments[0][0].lat, lng: gpxData.tracks[0].segments[0][0].lon },
      endLocation: {
        lat: gpxData.tracks[0].segments[0].slice(-1)[0].lat,
        lng: gpxData.tracks[0].segments[0].slice(-1)[0].lon
      },
    }
    res.json(gpxData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to parse GPX file');
  }
});

module.exports = router;
