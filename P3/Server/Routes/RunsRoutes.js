const express = require('express');
const router = express.Router();
const { parseGPX } = require('../GxpParser.js');
const Run = require('../models/Run');
const { geocodeLocation } = require('../GeoCoding.js');


router.post('/geocode', async (req, res) => {
  try {
    const { locationString } = req.body;
    const coordinates = await geocodeLocation(locationString);
    if (coordinates) {
      res.json({ coordinates });
    } else {
      res.status(404).send('Location not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Geocoding failed');
  }
});


// POST endpoint for creating a new run
router.post('/create', async (req, res) => {
  try {
    const { stops, length, totalTime } = req.body;
    const newRun = new Run({
      stops,
      length,
      totalTime,
      // Include other fields as necessary
    });

    await newRun.save();
    res.status(201).json(newRun);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error creating the run');
  }
});

router.get('/importGPX', async (req, res) => {
  try {
    const gpxData = await parseGPX('./Blacks-Mountain-Half-Marathon-2019.gpx');
    // Process and store the gpxData as needed
    res.json(gpxData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to parse GPX file');
  }
});

module.exports = router;
