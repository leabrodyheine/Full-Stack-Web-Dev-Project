const mongoose = require('mongoose');

const RunSchema = new mongoose.Schema({
  stopsCoordinate: [{
    latitude: Number,
    longitude: Number,
    description: String
  }],
  startLocationCoordinate: {
    type: { latitude: Number, longitude: Number },
    required: true
  },
  endLocationCoordinate: {
    type: { latitude: Number, longitude: Number },
    required: true
  },
  signUps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Renamed for consistency
  length: Number, // miles
  totalTime: Number, // total estimated time of run
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  pace: Number, //average mile pace
  runType: {
    type: String,
    enum: ['loop', 'out and back', 'point to point'],
    required: true,
  },
  completedBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    time: Number, // in minutes
    date: Date,
    distance: Number,
    pace: Number, // min per mile
  }],
  experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true }
});

module.exports = mongoose.model('Run', RunSchema);