const mongoose = require('mongoose');

const RunSchema = new mongoose.Schema({
  stops: [{ latitude: Number, longitude: Number, description: String }],
  runId: mongoose.Schema.Types.ObjectId,
  signups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  length: Number, //miles
  totalTime: Number, //total estimated time of run
  date: {
    type: Date,
    required: true, 
  },
  startTime: {
    type: String, // Could also consider using Date type depending on your needs
    required: true,
  },
  startLocation: {
    type: String,
    required: true,
  },
  endLocation: {
    type: String,
    required: true,
  },
  runType: {
    type: String,
    enum: ['loop', 'out and back', 'point to point'], // Restricts the value to one of these types
    required: true,
  },
});

module.exports = mongoose.model('Run', RunSchema);