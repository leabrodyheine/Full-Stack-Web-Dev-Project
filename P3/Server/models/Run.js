const mongoose = require('mongoose');

const RunSchema = new mongoose.Schema({
  stops: [{ latitude: Number, longitude: Number, description: String }],
  runId: mongoose.Schema.Types.ObjectId,
  signups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  length: Number, //miles
  totalTime: Number, //total estimated time of run
});

module.exports = mongoose.model('Run', RunSchema);