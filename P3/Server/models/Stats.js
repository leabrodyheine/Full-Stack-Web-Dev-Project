const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  runningStats: {
    distance: Number, // total miles ran
    time: Number, // total minutes ran 
    runs: Number, // number of runs
    experience: String,
    pace: Number, // average mile pace
  }
});

module.exports = mongoose.model('Stats', StatsSchema);