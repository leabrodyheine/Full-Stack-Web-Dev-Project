const mongoose = require('mongoose');
const DB = require('./DB');
const Run = require('../Server/models/Run');

// // MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/socialRunnersPlatform';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


async function deleteIncompleteRuns() {
  try {
    // Query for documents with missing or null values for required fields
    const query = {
      $or: [
        { stopsCoordinate: { $exists: false } },
        { startLocationCoordinate: { $exists: false } },
        { endLocationCoordinate: { $exists: false } },
        { length: { $exists: false } },
        { totalTime: { $exists: false } },
        { date: { $exists: false } },
        { startTime: { $exists: false } },
        { startLocation: { $exists: false } },
        { endLocation: { $exists: false } },
        { runPace: { $exists: false } },
        { runType: { $exists: false } },
        { experienceLevel: { $exists: false } }
      ]
    };

    // Delete documents that match the query
    const result = await Run.deleteMany(query);
    console.log(`${result.deletedCount} incomplete runs deleted successfully.`);
  } catch (error) {
    console.error('Error deleting incomplete runs:', error);
  }
}

// Call the function to delete incomplete runs
deleteIncompleteRuns();
