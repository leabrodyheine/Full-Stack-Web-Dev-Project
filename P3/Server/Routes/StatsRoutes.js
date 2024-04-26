const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Run = require('../models/Run');
const Stats = require('../models/Stats');


router.get('/user-stats/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(userId)
  // Convert string to ObjectId for MongoDB
  const objectIdUserId = new mongoose.Types.ObjectId(userId);

  try {
    const runs = await Run.find({ 'completedBy.userId': objectIdUserId });
    let totalDistance = 0;
    let totalTime = 0;
    let paceData = [];

    runs.forEach(run => {
      run.completedBy.forEach(completion => {
        if (completion.userId.toString() === userId) {
          totalDistance += completion.distance;
          totalTime += completion.time;
          paceData.push({ date: completion.date, pace: completion.time / completion.distance });
        }
      });
    });

    const statsData = {
      totalDistance,
      totalTime,
      runsCompleted: runs.length,
      paceData
    };

    res.json(statsData);

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
