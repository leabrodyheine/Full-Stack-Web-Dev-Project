const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  runningStats: {
    distance: Number, // in miles
    time: Number, // in minutes 
    runs: Number, // number of runs
    // Add more stats as needed
  }
});

module.exports = mongoose.model('Stats', StatsSchema);