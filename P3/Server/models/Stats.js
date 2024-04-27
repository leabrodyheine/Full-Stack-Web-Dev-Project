const mongoose = require('mongoose');

/**
 * Schema definition for the Stats model.
 * @typedef {Object} Stats
 * @property {mongoose.Schema.Types.ObjectId} userId - A reference ID to the associated user.
 * @property {Number} totalDistance - The total distance covered by the user in all runs.
 * @property {Number} totalTime - The total time spent by the user in all runs.
 * @property {Number} runs - The total number of runs completed by the user.
 * @property {Object[]} paceData - An array of objects detailing pace information for individual runs.
 * @property {Date} paceData.date - The date of the run.
 * @property {Number} paceData.pace - The pace of the user during the run.
 */
const statsSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  totalDistance: Number,
  totalTime: Number,
  runs: Number,
  paceData: [{
    date: Date,
    pace: Number
  }]
});

module.exports = mongoose.model('Stats', statsSchema);