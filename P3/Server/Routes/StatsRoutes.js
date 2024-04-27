const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Run = require('../models/Run');

/**
 * Helper function to calculate stats for completed runs.
 * @param {Array} runs - An array of run documents from the database.
 * @param {string} userId - The user's ID as a string.
 * @returns {Object} Stats data including total distance, total time, and pace data.
 */
const calculateUserStats = (runs, userId) => {
  let totalDistance = 0;
  let totalTime = 0;
  let paceData = [];

  runs.forEach(run => {
    run.completedBy.forEach(completion => {
      if (completion.userId.toString() === userId) {
        totalDistance += completion.distance;
        totalTime += completion.time;
        if (completion.distance > 0) {
          paceData.push({ date: completion.date, pace: completion.time / completion.distance });
        }
      }
    });
  });

  return {
    totalDistance,
    totalTime,
    runsCompleted: runs.length,
    paceData
  };
};

/**
 * Route to get statistics for a user.
 * @route GET /user-stats/:userId
 * @param {string} userId - The user's ID in the URL parameter.
 * @returns {Object} JSON object with the user's running statistics.
 */
router.get('/user-stats/:userId', async (req, res) => {
  const { userId } = req.params;
  const objectIdUserId = new mongoose.Types.ObjectId(userId);
  try {
    const runs = await Run.find({ 'completedBy.userId': objectIdUserId });
    const statsData = calculateUserStats(runs, userId);
    res.json(statsData);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
