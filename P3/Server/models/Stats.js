const mongoose = require('mongoose');

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