const mongoose = require('mongoose');

const RunSchema = new mongoose.Schema({
  stops: [{ latitude: Number, longitude: Number, description: String }],
  signUps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Renamed for consistency
  length: Number, // miles
  totalTime: Number, // total estimated time of run
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  runType: {
    type: String,
    enum: ['loop', 'out and back', 'point to point'],
    required: true,
  },
});

module.exports = mongoose.model('Run', RunSchema);