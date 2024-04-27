const mongoose = require('mongoose');

/**
 * Schema definition for the Run model.
 * @typedef {Object} Run
 * @property {Object[]} stopsCoordinate - Array of coordinates for stops during the run, each with latitude, longitude, and optional description.
 * @property {Object} startLocationCoordinate - GeoJSON Point for start location coordinates [longitude, latitude].
 * @property {Object} endLocationCoordinate - GeoJSON Point for end location coordinates [longitude, latitude].
 * @property {mongoose.Schema.Types.ObjectId[]} signUps - Array of user IDs who have signed up for the run.
 * @property {Number} length - Length of the run in miles.
 * @property {Number} totalTime - Total estimated time for the run in minutes.
 * @property {Date} date - The scheduled date for the run.
 * @property {String} startTime - Start time for the run.
 * @property {String} startLocation - Description of the start location.
 * @property {String} endLocation - Description of the end location.
 * @property {Number} runPace - Average pace of the run in minutes per mile.
 * @property {String} runType - Type of the run (e.g., loop, out and back, point to point).
 * @property {Object[]} completedBy - Array of objects detailing completion of the run by users, each with user ID, time taken, date of completion, distance, and pace.
 * @property {String} experienceLevel - The difficulty or experience level required for the run.
 */
const RunSchema = new mongoose.Schema({
  stopsCoordinate: [{
    latitude: Number,
    longitude: Number,
    description: String
  }],
  startLocationCoordinate: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  endLocationCoordinate: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  signUps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  length: Number,
  totalTime: Number,
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  runPace: Number,
  runType: {
    type: String,
    enum: ['loop', 'out and back', 'point to point'],
    required: true,
  },
  completedBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    time: Number,
    date: Date,
    distance: Number,
    pace: Number,
  }],
  experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true }
});

RunSchema.index({ 'startLocationCoordinate.coordinates': '2dsphere' });

module.exports = mongoose.model('Run', RunSchema);